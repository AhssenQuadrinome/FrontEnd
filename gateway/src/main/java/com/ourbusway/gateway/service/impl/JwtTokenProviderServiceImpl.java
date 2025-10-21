package com.ourbusway.gateway.service.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.ourbusway.gateway.service.JwtTokenProviderService;
import com.ourbusway.gateway.util.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtTokenProviderServiceImpl implements JwtTokenProviderService {

  @Override
  public String getClaimFromToken(String token, String claimName) {
    if (this.getClaimsFromToken(token).getClaim(claimName).isMissing()) {
      return null;
    } else {
      return this.getClaimsFromToken(token).getClaim(claimName).asString();
    }
  }

  @Override
  public DecodedJWT getClaimsFromToken(String token) {
    token = token.replace(SecurityUtils.TOKEN_TYPE, "").trim();
    return JWT.decode(token);
  }

  @Override
  public boolean isTokenExpired(String token) {
    return this.getClaimsFromToken(token).getExpiresAt().before(new Date());
  }
}
