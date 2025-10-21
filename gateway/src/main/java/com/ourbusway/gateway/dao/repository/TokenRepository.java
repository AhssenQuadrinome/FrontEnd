package com.ourbusway.gateway.dao.repository;

import com.ourbusway.gateway.model.TokenModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TokenRepository
    extends JpaRepository<TokenModel, String>, JpaSpecificationExecutor<TokenModel> {}
