package com.core.infrastructure.monitoring;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.Duration;

@ApplicationScoped
public class PrometheusMetricas {

    private static final Logger LOGGER = LoggerFactory.getLogger(PrometheusMetricas.class);

    private final Counter recargasRealizadasCounter;
    private final Timer tempoProcessamentoRecargaTimer;

    @Inject
    public PrometheusMetricas(MeterRegistry meterRegistry) {
        recargasRealizadasCounter = meterRegistry.counter("recarga_realizadas_total", "tipo", "celular");

        tempoProcessamentoRecargaTimer = meterRegistry.timer("recarga_tempo_processamento", "tipo", "celular");
    }


    public void incrementarContadorRecargas() {
        LOGGER.info("Incrementando contador de recargas realizadas");
        recargasRealizadasCounter.increment();
    }

    public void medirTempoDeProcessamento(Runnable operacaoRecarga) {
        LOGGER.info("Iniciando medição de tempo para operação de recarga");
        Timer.Sample sample = Timer.start();
        try {
            operacaoRecarga.run();
        } finally {
            sample.stop(tempoProcessamentoRecargaTimer);
            LOGGER.info("Operação de recarga concluída");
        }
    }


    public void simularRecargaComMonitoramento() {
        medirTempoDeProcessamento(() -> {
            try {
                Thread.sleep(Duration.ofSeconds(2).toMillis());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                LOGGER.error("Erro durante a simulação da recarga", e);
            }
            incrementarContadorRecargas();
        });
    }
}
