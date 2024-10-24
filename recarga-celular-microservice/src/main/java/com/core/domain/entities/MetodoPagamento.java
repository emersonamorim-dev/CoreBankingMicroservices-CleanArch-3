package com.core.domain.entities;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity
public class MetodoPagamento {

    @Id
    @GeneratedValue
    private UUID id;

    private String tipo;

    @Embedded
    private DetalhesPagamento detalhes;

    // Construtor padrão
    public MetodoPagamento() {
    }

    // Construtor completo
    public MetodoPagamento(String tipo, DetalhesPagamento detalhes) {
        this.tipo = tipo;
        this.detalhes = detalhes;
    }

    // Getters e Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public DetalhesPagamento getDetalhes() {
        return detalhes;
    }

    public void setDetalhes(DetalhesPagamento detalhes) {
        this.detalhes = detalhes;
    }
}
