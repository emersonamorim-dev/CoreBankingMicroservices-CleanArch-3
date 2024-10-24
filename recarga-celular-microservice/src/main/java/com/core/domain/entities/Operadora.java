package com.core.domain.entities;

public enum Operadora {
    TIM("TIM", "001"),
    CLARO("Claro", "002"),
    OI("Oi", "003");

    private final String nome;
    private final String codigo;

    Operadora(String nome, String codigo) {
        this.nome = nome;
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public String getCodigo() {
        return codigo;
    }
}
