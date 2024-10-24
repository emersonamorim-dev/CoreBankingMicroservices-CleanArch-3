package com.core.application.usecase;

import com.core.domain.entities.Recarga;
import com.core.domain.repositories.RecargaRepository;
import com.core.infrastructure.monitoring.PrometheusMetricas;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;

@ApplicationScoped
public class RealizarRecargaUseCase {

    private static final Logger LOGGER = LoggerFactory.getLogger(RealizarRecargaUseCase.class);

    @Inject
    private RecargaRepository recargaRepository;

    @Inject
    private PrometheusMetricas prometheusMetricas;

    public Recarga executar(Recarga recarga) {
        LOGGER.info("Executando regras de negócio para recarga do número: {}", recarga.getTelefone());

        // validação e regras de negócio
        if (recarga.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            LOGGER.error("Valor da recarga inválido: {}", recarga.getValor());
            throw new IllegalArgumentException("Valor da recarga deve ser maior que zero");
        }

        prometheusMetricas.medirTempoDeProcessamento(() -> {
            LOGGER.info("Iniciando processo de recarga");
        });

        Recarga novaRecarga = recargaRepository.salvar(recarga);
        LOGGER.info("Recarga salva com sucesso. ID: {}", novaRecarga.getId());

        prometheusMetricas.incrementarContadorRecargas();

        return novaRecarga;
    }
}
