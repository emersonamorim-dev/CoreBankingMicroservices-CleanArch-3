import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheServico {
  private readonly redisClient: Redis;
  private readonly logger = new Logger(CacheServico.name);  

  constructor(private configService: ConfigService) {
    // Configura o Redis
    const host = this.configService.get<string>('REDIS_HOST', 'redis-cache');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    // Inicializa o cliente Redis
    this.redisClient = new Redis({
      host,
      port,
    });

    this.redisClient.on('error', (error) => {
      this.logger.error(`Erro ao conectar ao Redis: ${error.message}`);
    });

    this.logger.log(`Conectado ao Redis na host ${host} e porta ${port}`);
  }

  async armazenarCache(key: string, value: any): Promise<void> {
    try {
      await this.redisClient.set(key, JSON.stringify(value));
      this.logger.log(`Dado armazenado no cache com a chave ${key}.`);
    } catch (error) {
      this.logger.error(`Erro ao armazenar no cache com a chave ${key}: ${error.message}`);
    }
  }

  async obterCache(key: string): Promise<any> {
    try {
      const data = await this.redisClient.get(key);
      this.logger.log(`Dado recuperado do cache com a chave ${key}.`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`Erro ao obter dado do cache com a chave ${key}: ${error.message}`);
      return null;  
    }
  }


  async incrementarNumeroConsultas(placa: string): Promise<void> {
    try {
      await this.redisClient.incr(placa);  
      this.logger.log(`Consulta para placa ${placa} incrementada com sucesso.`);
    } catch (error) {
      this.logger.error(`Erro ao incrementar consultas para a placa ${placa}: ${error.message}`);
    }
  }


  async obterNumeroConsultas(placa: string): Promise<number> {
    try {
      const consultas = await this.redisClient.get(placa);
      this.logger.log(`Número de consultas para a placa ${placa}: ${consultas || 0}`);
      return consultas ? parseInt(consultas, 10) : 0;
    } catch (error) {
      this.logger.error(`Erro ao obter o número de consultas para a placa ${placa}: ${error.message}`);
      return 0;  
    }
  }
}
