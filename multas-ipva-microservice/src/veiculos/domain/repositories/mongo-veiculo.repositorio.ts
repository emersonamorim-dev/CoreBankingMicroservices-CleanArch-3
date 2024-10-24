import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VeiculoDocumento } from '../../infrastructure/schemas/veiculo.esquema';
import { Veiculo } from '../entities/veiculo.entity';
import { VeiculoRepositorio } from './veiculo.repositorio';
import { CacheServico } from '../../infrastructure/redis/cache.servico';
import { CriarVeiculoDto } from '../../presentation/dto/criar-veiculo.dto';

export class MongoVeiculoRepositorio implements VeiculoRepositorio {
  constructor(
    @InjectModel('Veiculo') private veiculoModel: Model<VeiculoDocumento>,
    private readonly cacheServico: CacheServico,  
  ) {}

  async criarVeiculo(veiculo: Veiculo): Promise<Veiculo> {
    // Criação de um novo veículo no banco de dados MongoDB
    const novoVeiculo = new this.veiculoModel({
      placa: veiculo.placa,
      multas: veiculo.multas,
      ipva: veiculo.ipva,
      idProprietario: veiculo.idProprietario, 
    });

    // Salva o veículo no banco de dados e retorna a entidade criada
    const veiculoDocumento = await novoVeiculo.save();

    return new Veiculo(
      veiculoDocumento.placa,
      veiculoDocumento.multas,
      veiculoDocumento.ipva,
      veiculoDocumento.idProprietario 
    );
  }

  

  async buscarPorPlaca(placa: string): Promise<Veiculo> {
    const veiculo = await this.veiculoModel.findOne({ placa });
    if (!veiculo) throw new Error('Veículo não encontrado');
    
    return new Veiculo(veiculo.placa, veiculo.multas, veiculo.ipva, veiculo.idProprietario);
  }


  async adicionarConsulta(placa: string): Promise<void> {
    await this.cacheServico.incrementarNumeroConsultas(placa);
  }

  async obterNumeroConsultas(placa: string): Promise<number> {
    const consultas = await this.cacheServico.obterNumeroConsultas(placa);
    return consultas;
  }
}
