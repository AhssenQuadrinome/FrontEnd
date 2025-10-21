package com.ourbusway.gateway.resource.error;

import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class ErrorDetailsResource {
    private String title;
    private int status;
    private String detail;
    private long timestamp;
    private String developerMessage;
    private String code;
    private Map<String, List<ValidationErrorResource>> errors =
            new HashMap<String, List<ValidationErrorResource>>();
}
