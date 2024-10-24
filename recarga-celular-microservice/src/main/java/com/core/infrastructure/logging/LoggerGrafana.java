package com.core.infrastructure.logging;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ApplicationScoped
public class LoggerGrafana {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoggerGrafana.class);

    private final Counter recargaCounter;

    @Inject
    public LoggerGrafana(MeterRegistry meterRegistry) {
        recargaCounter = meterRegistry.counter("recarga_realizadas_total", "tipo", "celular");
    }


    public void logInfo(String mensagem) {
        LOGGER.info(mensagem);
    }


    public void logWarn(String mensagem) {
        LOGGER.warn(mensagem);
    }


    public void logError(String mensagem, Throwable throwable) {
        LOGGER.error(mensagem, throwable);
    }


    public void incrementarContadorRecargas() {
        LOGGER.info("Incrementando contador de recargas realizadas");
        recargaCounter.increment();
    }


    public void logRecargaRealizada(String numeroCelular, double valorRecarga) {
        LOGGER.info("Recarga realizada com sucesso: Número do Celular: {}, Valor: {}", numeroCelular, valorRecarga);
        incrementarContadorRecargas();
    }
}
