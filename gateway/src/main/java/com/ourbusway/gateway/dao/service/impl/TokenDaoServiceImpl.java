package com.ourbusway.gateway.dao.service.impl;

import com.ourbusway.gateway.dao.repository.TokenRepository;
import com.ourbusway.gateway.dao.service.TokenDaoService;
import com.ourbusway.gateway.model.TokenModel;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenDaoServiceImpl implements TokenDaoService {

  private final TokenRepository tokenRepository;

  @Override
  public TokenModel save(TokenModel token) {
    return tokenRepository.save(token);
  }

  @Override
  public boolean existsBy(Specification<TokenModel> specification) {
    return tokenRepository.exists(specification);
  }

}
