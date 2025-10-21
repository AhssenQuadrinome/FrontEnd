package com.ourbusway.gateway.controller.impl;

import com.ourbusway.gateway.controller.ErrorController;
import com.ourbusway.gateway.exception.AbstractBaseException;
import com.ourbusway.gateway.exception.AuthorizationForbiddenException;
import com.ourbusway.gateway.resource.error.ErrorDetailsResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ServerWebExchange;

import java.time.Instant;

@RestControllerAdvice
public class ErrorControllerImpl implements ErrorController {
  @Override
  @ExceptionHandler({AuthorizationForbiddenException.class})
  public ResponseEntity<ErrorDetailsResource> handleGenericExceptions(
      AbstractBaseException e, ServerWebExchange exchange) {
    ErrorDetailsResource errorDetailResource = new ErrorDetailsResource();
    errorDetailResource.setTimestamp(Instant.now().toEpochMilli());
    errorDetailResource.setTitle(e.getTitle().toString());
    errorDetailResource.setCode(e.getTitle().getCode());
    errorDetailResource.setDeveloperMessage(e.getClass().getName());
    errorDetailResource.setStatus(e.getStatus().value());
    errorDetailResource.setDetail(e.getMessage());
    return new ResponseEntity<>(errorDetailResource, e.getStatus());
  }
}
