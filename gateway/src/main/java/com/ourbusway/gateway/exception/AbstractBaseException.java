package com.ourbusway.gateway.exception;

import com.ourbusway.gateway.exception.enumeration.BaseExceptionEnum;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class AbstractBaseException extends RuntimeException {

  private final HttpStatus status;

  private final BaseExceptionEnum title;

  public AbstractBaseException(BaseExceptionEnum title, HttpStatus status, String message) {
    super(message);
    this.title = title;
    this.status = status;
  }
}
