import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQServico implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQServico.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    await this.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }

  private async connect(): Promise<void> {
    try {
      const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      this.logger.log('Conectado ao RabbitMQ com sucesso');

      // Cria a exchange Direct chamada 'veiculos'
      const exchangeName = 'veiculos';
      await this.channel.assertExchange(exchangeName, 'direct', { durable: true });
      this.logger.log(`Exchange ${exchangeName} criada com sucesso`);

      // Cria filas e fazer binding na exchange 'veiculos'
      await this.criarFilaEConectarExchange('fila-veiculo-criado', 'veiculo.criado');
      await this.criarFilaEConectarExchange('fila-consulta-veiculo', 'consultas_veiculo');

    } catch (error) {
      this.logger.error('Erro ao conectar ao RabbitMQ', error);
      throw error;
    }
  }

  private async criarFilaEConectarExchange(fila: string, routingKey: string): Promise<void> {
    try {
      // Cria a fila e conecta com a exchange usando a routingKey fornecida
      await this.channel.assertQueue(fila, { durable: true });
      await this.channel.bindQueue(fila, 'veiculos', routingKey);
      this.logger.log(`Fila ${fila} criada e conectada à exchange veiculos com chave ${routingKey}`);
    } catch (error) {
      this.logger.error(`Erro ao criar a fila ${fila} e fazer binding`, error);
      throw error;
    }
  }

  private async ensureChannelIsConnected(): Promise<void> {
    if (!this.channel || this.channel.connection.closed) {
      this.logger.warn('Canal do RabbitMQ não está conectado, tentando reconectar...');
      await this.connect();
    }
  }

  async sendMessage(exchange: string, routingKey: string, message: any): Promise<void> {
    try {
      await this.ensureChannelIsConnected();
      await this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
      this.logger.log(`Mensagem enviada para a exchange ${exchange} com chave de roteamento ${routingKey}`);
    } catch (error) {
      this.logger.error('Erro ao enviar mensagem', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.logger.log('Canal RabbitMQ fechado');
      }
      if (this.connection) {
        await this.connection.close();
        this.logger.log('Conexão RabbitMQ fechada');
      }
    } catch (error) {
      this.logger.error('Erro ao fechar a conexão com RabbitMQ', error);
      throw error;
    }
  }
}
