package com.ourbusway.gateway.config;

import feign.Capability;
import feign.micrometer.MicrometerCapability;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.tracing.exporter.SpanExportingPredicate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TracingConfig {

  @Bean
  SpanExportingPredicate noActuator() {
    return span ->
            span.getTags().get("uri") == null || !span.getTags().get("uri").startsWith("/actuator");
  }

  @Bean
  SpanExportingPredicate noSwagger() {
    return span ->
        span.getTags().get("uri") == null || !span.getTags().get("uri").startsWith("/swagger");
  }

  @Bean
  SpanExportingPredicate noApiDocs() {
    return span ->
        span.getTags().get("uri") == null || !span.getTags().get("uri").startsWith("/v3/api-docs");
  }
  
  @Bean
  public Capability capability(final MeterRegistry registry) {
    return new MicrometerCapability(registry);
  }
}
