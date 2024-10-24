package com.core.application.services;

import com.core.application.usecase.RealizarRecargaUseCase;
import com.core.domain.entities.Recarga;
import com.core.domain.repositories.RecargaRepository;
import com.core.infrastructure.logging.LoggerGrafana;
import com.core.infrastructure.messaging.RabbitMQService;

import io.quarkus.redis.datasource.value.SetArgs;
import io.quarkus.redis.datasource.value.ValueCommands;
import io.quarkus.redis.datasource.RedisDataSource;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class RecargaService {

    private static final Logger LOGGER = LoggerFactory.getLogger(RecargaService.class);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper().registerModule(new JavaTimeModule());

    @Inject
    private RealizarRecargaUseCase realizarRecargaUseCase;

    @Inject
    private RecargaRepository recargaRepository;

    @Inject
    private RabbitMQService rabbitMQService;

    @Inject
    private LoggerGrafana loggerGrafana;

    @Inject
    private RedisDataSource redisDataSource;

    private ValueCommands<String, String> redisClient;

    @PostConstruct
    public void init() {
        // Inicia o cliente Redis para valores chave-valor do tipo String
        redisClient = redisDataSource.value(String.class);
    }

    @Transactional
    public Recarga realizarRecarga(Recarga recarga) {
        // Verifica no cache se a recarga foi recentemente realizada
        String cacheKey = "recarga:" + recarga.getTelefone();
        String cacheResult = redisClient.get(cacheKey);

        if (cacheResult != null) {
            LOGGER.info("Recarga encontrada no cache para o telefone: {}", recarga.getTelefone());
            return convertStringToRecarga(cacheResult); 
        }

        Recarga novaRecarga = realizarRecargaUseCase.executar(recarga);

        // Salva a recarga no cache com tempo de expiração de 5 minutos
        redisClient.set(cacheKey, convertRecargaToString(novaRecarga), new SetArgs().ex(300));
        LOGGER.info("Recarga salva no cache para o telefone: {}", recarga.getTelefone());

        // Envia a mensagem para a fila RabbitMQ
        rabbitMQService.enviarMensagem("Recarga realizada para o telefone: " + recarga.getTelefone());
        loggerGrafana.incrementarContadorRecargas();

        return novaRecarga;
    }

    public Recarga buscarRecargaPorId(UUID id) {
        return recargaRepository.buscarPorId(id).orElse(null);
    }

    public List<Recarga> listarRecargas() {
        return recargaRepository.listarTodas();
    }

    @Transactional
    public void deletarRecarga(UUID id) {
        recargaRepository.deletarPorId(id);
    }

    public List<String> listarOperadoras() {
        return List.of("Operadora A", "Operadora B", "Operadora C");
    }

    private String convertRecargaToString(Recarga recarga) {
        try {
            return OBJECT_MAPPER.writeValueAsString(recarga);
        } catch (IOException e) {
            LOGGER.error("Erro ao converter o objeto Recarga para JSON", e);
            throw new RuntimeException("Erro ao converter Recarga para JSON", e);
        }
    }

    private Recarga convertStringToRecarga(String cacheResult) {
        try {
            return OBJECT_MAPPER.readValue(cacheResult, Recarga.class);
        } catch (IOException e) {
            LOGGER.error("Erro ao converter JSON para objeto Recarga", e);
            throw new RuntimeException("Erro ao converter JSON para Recarga", e);
        }
    }
}
