package com.ourbusway.gateway.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "TOKEN")
public class TokenModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "UUID")
    protected String uuid;

    @ToString.Exclude
    @Column(columnDefinition = "TEXT")
    private String value;
}
