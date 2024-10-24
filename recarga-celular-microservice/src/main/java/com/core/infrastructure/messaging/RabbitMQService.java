package com.core.infrastructure.messaging;

import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
import io.quarkus.runtime.Startup;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

@Startup
@ApplicationScoped
public class RabbitMQService {

    private static final Logger LOGGER = LoggerFactory.getLogger(RabbitMQService.class);

    private Connection connection;
    private Channel channel;

    private final String exchangeName = "recarga-topic-exchange";
    private final String queueName = "recarga-queue";
    private final String routingKey = "recarga.nova";

    @PostConstruct
    public void configurarRabbitMQ() {
        int maxRetries = 5;
        int retryCount = 0;
        boolean connected = false;

        while (retryCount < maxRetries && !connected) {
            try {
                LOGGER.info("Tentando conectar ao RabbitMQ... Tentativa {}", retryCount + 1);

                // Cria a conexão e o canal
                ConnectionFactory factory = new ConnectionFactory();
                factory.setHost("rabbitmq");
                factory.setUsername("guest");
                factory.setPassword("guest");

                connection = factory.newConnection();
                channel = connection.createChannel();

                // Declara a exchange
                channel.exchangeDeclare(exchangeName, BuiltinExchangeType.TOPIC, true);
                LOGGER.info("Exchange '{}' criada com sucesso", exchangeName);

                // Declara a fila reutilizável
                channel.queueDeclare(queueName, true, false, false, null);
                LOGGER.info("Fila '{}' criada com sucesso", queueName);

                // Faz o bind da fila com a exchange
                channel.queueBind(queueName, exchangeName, routingKey);
                LOGGER.info("Fila '{}' ligada à exchange '{}' com a routing key '{}'", queueName, exchangeName, routingKey);

                iniciarConsumidor();

                connected = true;

            } catch (IOException | TimeoutException e) {
                LOGGER.error("Erro ao configurar exchange ou fila. Tentando novamente em 5 segundos...", e);
                retryCount++;
                try {
                    Thread.sleep(5000); 
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    LOGGER.error("Erro ao esperar para tentar nova conexão", ie);
                }
            }
        }

        if (!connected) {
            LOGGER.error("Não foi possível conectar ao RabbitMQ após {} tentativas", maxRetries);
        }
    }

    public void enviarMensagem(String mensagem) {
        try {
            if (channel == null || !channel.isOpen()) {
                LOGGER.error("Canal não está aberto. Não é possível enviar a mensagem.");
                return;
            }

            // Publica a mensagem na exchange com a routing key configurada
            channel.basicPublish(exchangeName, routingKey, null, mensagem.getBytes());
            LOGGER.info("Mensagem enviada com sucesso para a exchange '{}': {}", exchangeName, mensagem);

        } catch (IOException e) {
            LOGGER.error("Erro ao enviar mensagem", e);
        }
    }

    private void iniciarConsumidor() {
        try {
            DeliverCallback deliverCallback = (consumerTag, delivery) -> {
                String mensagem = new String(delivery.getBody(), "UTF-8");
                LOGGER.info("Mensagem recebida: {}", mensagem);

                // Faz o acknowledgment manual da mensagem
                channel.basicAck(delivery.getEnvelope().getDeliveryTag(), false);
                LOGGER.info("Mensagem com tag '{}' confirmada.", delivery.getEnvelope().getDeliveryTag());
            };

            // Inicia o consumo da fila com autoAck desativado (false) para fazer o ack manualmente
            channel.basicConsume(queueName, false, deliverCallback, consumerTag -> {
                LOGGER.info("Consumo cancelado para tag: {}", consumerTag);
            });

            LOGGER.info("Consumidor iniciado para a fila '{}'", queueName);
        } catch (IOException e) {
            LOGGER.error("Erro ao iniciar o consumidor para a fila '{}'", queueName, e);
        }
    }

    public void fecharConexao() {
        try {
            if (channel != null && channel.isOpen()) {
                channel.close();
            }
            if (connection != null && connection.isOpen()) {
                connection.close();
            }
        } catch (IOException | TimeoutException e) {
            LOGGER.error("Erro ao fechar a conexão ou canal", e);
        }
    }
}
