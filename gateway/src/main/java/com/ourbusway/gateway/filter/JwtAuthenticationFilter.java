package com.ourbusway.gateway.filter;

import com.ourbusway.gateway.dao.service.TokenDaoService;
import com.ourbusway.gateway.dao.specification.TokenSpecification;
import com.ourbusway.gateway.exception.AuthorizationForbiddenException;
import com.ourbusway.gateway.exception.enumeration.AuthorizationForbiddenExceptionTitleEnum;
import com.ourbusway.gateway.model.TokenModel;
import com.ourbusway.gateway.resource.TokenValidationPostResource;
import com.ourbusway.gateway.service.JwtTokenProviderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements GlobalFilter {

  private final JwtTokenProviderService jwtTokenProviderService;
  private final TokenDaoService tokenDaoService;
  private final WebClient webClient;
  private static final String AUTHORIZATION_HEADER = "Authorization";

  @Override
  public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
    List<String> headers = exchange.getRequest().getHeaders().get(AUTHORIZATION_HEADER);
    if (CollectionUtils.isEmpty(headers)) {
      log.trace("Request received without an authorization token.");
      return chain.filter(exchange);
    } else {
      String authToken = headers.getFirst();
      log.debug("Checking if token has expired ...");
      if (jwtTokenProviderService.isTokenExpired(authToken)) {
        log.info("Token has expired. Will throw an error ...");
        throw new AuthorizationForbiddenException(
            AuthorizationForbiddenExceptionTitleEnum.TOKEN_NOT_VALID, "Token is expired");
      } else {
        log.info("Checking if the token is valid and already saved in database ...");

        return Mono.fromCallable(
                () -> tokenDaoService.existsBy(TokenSpecification.withToken(authToken)))
            .subscribeOn(Schedulers.boundedElastic()) // Use a bounded thread pool for blocking I/O
            .flatMap(
                exists -> {
                  if (exists) {
                    log.debug("Token found in the database. Proceeding with request.");
                    return chain.filter(exchange);
                  } else {
                    log.debug("Token not found in database. Validating with UAA service...");
                    return validateAndSaveToken(authToken, exchange, chain);
                  }
                });
      }
    }
  }

  private Mono<Void> validateAndSaveToken(
      String authToken, ServerWebExchange exchange, GatewayFilterChain chain) {
    return webClient
        .post()
        .uri("http://uaa/validate-token")
        .body(
            Mono.just(new TokenValidationPostResource(authToken)),
            TokenValidationPostResource.class)
        .retrieve()
        .onStatus(
            status -> status.is4xxClientError() || status.is5xxServerError(),
            response -> {
              log.debug("Token validation failed by UAA service with client/server error.");
              return Mono.error(
                  new AuthorizationForbiddenException(
                      AuthorizationForbiddenExceptionTitleEnum.TOKEN_NOT_VALID,
                      "Token is not valid"));
            })
        .bodyToMono(Void.class) // Handle the response body if needed, but here we expect none
        .then(
            Mono.fromRunnable(
                () -> {
                  log.debug("Token validated by UAA service. Saving to database.");
                  TokenModel token = new TokenModel();
                  token.setValue(authToken);
                  tokenDaoService.save(token);
                  log.info("Token successfully saved: {}", token.getUuid());
                }))
        .then(chain.filter(exchange)); // Continue the filter chain after saving
  }
}
