import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { Veiculo } from '../../domain/entities/veiculo.entity';
import { CacheServico } from '../../infrastructure/redis/cache.servico';
import { RabbitMQServico } from '../../infrastructure/messaging/rabbitmq.servico';
import { VeiculoRepositorio } from '../../domain/repositories/veiculo.repositorio'; 

@Injectable()
export class ConsultarDividaVeiculoCasoDeUso {
  private readonly logger = new Logger(ConsultarDividaVeiculoCasoDeUso.name);

  constructor(
    @Inject('VeiculoRepositorio') // Usa a string 'VeiculoRepositorio' para injeção
    private readonly veiculoRepositorio: VeiculoRepositorio,
    private readonly cacheServico: CacheServico,
    private readonly rabbitMQServico: RabbitMQServico,
  ) {}

  async executar(placa: string): Promise<Veiculo> {
    const cacheKey = `veiculo-divida-${placa}`;
    const cachedVeiculo = await this.cacheServico.obterCache(cacheKey);

    if (cachedVeiculo) {
      this.logger.log(`Dívida do veículo com a placa ${placa} recuperada do cache.`);
      return JSON.parse(cachedVeiculo);
    }

    const veiculo = await this.veiculoRepositorio.buscarPorPlaca(placa);
    if (!veiculo) {
      this.logger.warn(`Veículo com a placa ${placa} não encontrado.`);
      throw new NotFoundException('Veículo não encontrado.');
    }

    await this.cacheServico.armazenarCache(cacheKey, JSON.stringify(veiculo));

    await this.rabbitMQServico.sendMessage(
      'veiculos', // Exchange
      'consultas_divida_veiculo', // Routing key
      {
        placa,
        timestamp: new Date().toISOString(),
      } 
    );

    this.logger.log(`Consulta de dívida do veículo com a placa ${placa} enviada ao RabbitMQ.`);

    return veiculo;
  }
}
