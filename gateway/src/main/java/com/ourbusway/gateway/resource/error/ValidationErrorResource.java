package com.ourbusway.gateway.resource.error;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class ValidationErrorResource {
    private String code;
    private String message;
}
