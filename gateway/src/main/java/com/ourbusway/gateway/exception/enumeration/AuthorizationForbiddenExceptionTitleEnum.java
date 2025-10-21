package com.ourbusway.gateway.exception.enumeration;

public enum AuthorizationForbiddenExceptionTitleEnum implements BaseExceptionEnum {

  TOKEN_NOT_VALID("GTW_AUTH_FORB_ERR_1");

  private final String code;

  AuthorizationForbiddenExceptionTitleEnum(String code) {
    this.code = code;
  }
  
  @Override
  public String getCode() {
    return code;
  }
}
