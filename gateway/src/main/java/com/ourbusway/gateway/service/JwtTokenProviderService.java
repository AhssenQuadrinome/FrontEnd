package com.ourbusway.gateway.service;

import com.auth0.jwt.interfaces.DecodedJWT;

public interface JwtTokenProviderService {

  String getClaimFromToken(String token, String claimName);

  DecodedJWT getClaimsFromToken(String token);

  boolean isTokenExpired(String token);
}
