package com.ourbusway.gateway.config;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.client.loadbalancer.reactive.ReactorLoadBalancerExchangeFilterFunction;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@RequiredArgsConstructor
public class BeanConfig {

  private final ReactorLoadBalancerExchangeFilterFunction lbFunction;

  @Bean
  public WebClient webclientBuilder() {
    return WebClient.builder().filter(lbFunction).build();
  }
}
