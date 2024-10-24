import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheServico } from '../../infrastructure/redis/cache.servico';
import { RabbitMQServico } from '../../infrastructure/messaging/rabbitmq.servico';
import { VeiculoDocumento } from '../../infrastructure/schemas/veiculo.esquema';
import { Veiculo } from '../../domain/entities/veiculo.entity';
import { CriarVeiculoDto } from '../../presentation/dto/criar-veiculo.dto';

@Injectable()
export class VeiculoServico {
  private readonly logger = new Logger(VeiculoServico.name);

  constructor(
    private readonly cacheServico: CacheServico,
    private readonly rabbitMQServico: RabbitMQServico,
    @InjectModel('Veiculo') private readonly veiculoModel: Model<VeiculoDocumento>,
  ) {}

  async criarVeiculo(criarVeiculoDto: CriarVeiculoDto): Promise<any> {
    const veiculo = new Veiculo(
        criarVeiculoDto.placa,
        criarVeiculoDto.multas,
        criarVeiculoDto.ipva,
        criarVeiculoDto.idProprietario,
    );

    const veiculoSalvo = await this.veiculoModel.create(veiculo);
    const dividaTotal = veiculo.obterDividaTotal();

    const resultado = {
        placa: veiculoSalvo.placa,
        multas: veiculoSalvo.multas,
        ipva: veiculoSalvo.ipva,
        idProprietario: veiculoSalvo.idProprietario,
        dividaTotal,
    };

    try {
        await this.rabbitMQServico.sendMessage('veiculos', 'veiculo.criado', {
            ...resultado,
            timestamp: new Date().toISOString(),
        });
        this.logger.log(`Veículo com a placa ${veiculoSalvo.placa} criado e mensagem enviada para RabbitMQ.`);
    } catch (error) {
        this.logger.error(`Erro ao enviar mensagem para RabbitMQ. Detalhes: ${error.message}`);
        throw error;
    }

    return resultado;
  }

  async consultarVeiculo(placa: string): Promise<Veiculo> {
    const numeroConsultas = await this.cacheServico.obterNumeroConsultas(placa);

    if (numeroConsultas >= 5) {
      throw new Error('Limite de consultas atingido para esta semana.');
    }

    await this.cacheServico.incrementarNumeroConsultas(placa);

    const veiculoDocumento = await this.veiculoModel.findOne({ placa }).exec();
    if (!veiculoDocumento) {
      throw new Error('Veículo não encontrado.');
    }

    const veiculo = new Veiculo(
      veiculoDocumento.placa,
      veiculoDocumento.multas,
      veiculoDocumento.ipva,
      veiculoDocumento.idProprietario,
    );

    const mensagem = {
      placa,
      numeroConsultas: numeroConsultas + 1,
      timestamp: new Date().toISOString(),
    };

    // Envia mensagem para o RabbitMQ
    await this.rabbitMQServico.sendMessage('veiculos', 'consultas_veiculo', mensagem);

    this.logger.log(`Consulta para a placa ${placa} enviada ao RabbitMQ.`);

    return veiculo;
  }
 

  async parcelarDivida(placa: string, numeroParcelas: number): Promise<any> {
    const veiculoDocumento = await this.veiculoModel.findOne({ placa }).exec();
    if (!veiculoDocumento) {
        throw new Error('Veículo não encontrado.');
    }

    const veiculo = new Veiculo(
        veiculoDocumento.placa,
        veiculoDocumento.multas,
        veiculoDocumento.ipva,
        veiculoDocumento.idProprietario,
    );

    const dividaTotal = veiculo.obterDividaTotal();
    const valorParcela = parseFloat((dividaTotal / numeroParcelas).toFixed(2)); // Arredondando para 2 casas decimais

    return {
        placa: veiculo.placa,
        dividaTotal,
        numeroParcelas,
        valorParcela,
        formasPagamento: ['Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Pix'],
    };
}


  async obterNumeroConsultas(placa: string): Promise<number> {
    return this.cacheServico.obterNumeroConsultas(placa);
  }
}
