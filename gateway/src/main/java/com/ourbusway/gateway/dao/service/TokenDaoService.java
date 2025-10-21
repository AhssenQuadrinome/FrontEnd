package com.ourbusway.gateway.dao.service;

import com.ourbusway.gateway.model.TokenModel;
import org.springframework.data.jpa.domain.Specification;

public interface TokenDaoService {

  TokenModel save(TokenModel token);

  boolean existsBy(Specification<TokenModel> specification);
}
