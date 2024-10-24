package com.core.domain.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
public class Recarga {

    @Id
    @GeneratedValue
    private UUID id;

    private String telefone;

    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    private Operadora operadora;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "metodo_pagamento_id", referencedColumnName = "id")
    private MetodoPagamento metodoPagamento;

    private UUID idTransacao;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dataRecarga;

    @Version
    private int versao;

    // Construtor padrão
    public Recarga() {
        this.dataRecarga = LocalDateTime.now(); 
    }

    // Construtor completo
    public Recarga(String telefone, BigDecimal valor, Operadora operadora, MetodoPagamento metodoPagamento, UUID idTransacao) {
        this.telefone = telefone;
        this.valor = valor;
        this.operadora = operadora;
        this.metodoPagamento = metodoPagamento;
        this.idTransacao = idTransacao;
        this.dataRecarga = LocalDateTime.now();
    }

    // Getters e Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Operadora getOperadora() {
        return operadora;
    }

    public void setOperadora(Operadora operadora) {
        this.operadora = operadora;
    }

    public MetodoPagamento getMetodoPagamento() {
        return metodoPagamento;
    }

    public void setMetodoPagamento(MetodoPagamento metodoPagamento) {
        this.metodoPagamento = metodoPagamento;
    }

    public UUID getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(UUID idTransacao) {
        this.idTransacao = idTransacao;
    }

    public LocalDateTime getDataRecarga() {
        return dataRecarga;
    }

    public void setDataRecarga(LocalDateTime dataRecarga) {
        this.dataRecarga = dataRecarga;
    }

    public int getVersao() {
        return versao;
    }

    public void setVersao(int versao) {
        this.versao = versao;
    }
}
