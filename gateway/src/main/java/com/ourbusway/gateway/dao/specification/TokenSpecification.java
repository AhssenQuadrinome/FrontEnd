package com.ourbusway.gateway.dao.specification;

import com.ourbusway.gateway.model.TokenModel;
import com.ourbusway.gateway.model.TokenModel_;
import org.springframework.data.jpa.domain.Specification;

public class TokenSpecification {

    public static Specification<TokenModel> withToken(String token) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get(TokenModel_.VALUE), token);
    }
}
