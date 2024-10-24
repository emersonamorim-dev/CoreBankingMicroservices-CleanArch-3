package com.core.domain.entities;

import jakarta.persistence.Embeddable;

@Embeddable
public class DetalhesPagamento {

    private String numeroCartao;
    private String nomeTitular;
    private String validade;
    private String cvv;

    // Construtor padrão
    public DetalhesPagamento() {
    }

    // Construtor completo
    public DetalhesPagamento(String numeroCartao, String nomeTitular, String validade, String cvv) {
        this.numeroCartao = numeroCartao;
        this.nomeTitular = nomeTitular;
        this.validade = validade;
        this.cvv = cvv;
    }

    // Getters e Setters
    public String getNumeroCartao() {
        return numeroCartao;
    }

    public void setNumeroCartao(String numeroCartao) {
        this.numeroCartao = numeroCartao;
    }

    public String getNomeTitular() {
        return nomeTitular;
    }

    public void setNomeTitular(String nomeTitular) {
        this.nomeTitular = nomeTitular;
    }

    public String getValidade() {
        return validade;
    }

    public void setValidade(String validade) {
        this.validade = validade;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }
}
