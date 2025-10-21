package com.ourbusway.gateway.controller;

import com.ourbusway.gateway.exception.AbstractBaseException;
import com.ourbusway.gateway.resource.error.ErrorDetailsResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ServerWebExchange;

public interface ErrorController {

    ResponseEntity<ErrorDetailsResource> handleGenericExceptions(
            AbstractBaseException e, ServerWebExchange exchange);
    
}
