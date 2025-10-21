package com.ourbusway.gateway.exception;

import com.ourbusway.gateway.exception.enumeration.AuthorizationForbiddenExceptionTitleEnum;
import org.springframework.http.HttpStatus;

public class AuthorizationForbiddenException extends AbstractBaseException {
  public AuthorizationForbiddenException(
      AuthorizationForbiddenExceptionTitleEnum title, String message) {
    super(title, HttpStatus.FORBIDDEN, message);
  }
}
