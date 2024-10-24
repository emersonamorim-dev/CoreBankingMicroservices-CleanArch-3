import { Test, TestingModule } from '@nestjs/testing';
import { ConsultarDividaVeiculoCasoDeUso } from '@src/veiculos/application/usecases/consultar-divida-veiculo.caso-de-uso';
import { VeiculoRepositorio } from '@src/veiculos/domain/repositories/veiculo.repositorio';
import { CacheServico } from '@src/veiculos/infrastructure/redis/cache.servico';
import { RabbitMQServico } from '@src/veiculos/infrastructure/messaging/rabbitmq.servico';
import { Logger, NotFoundException } from '@nestjs/common';
import { Veiculo } from '@src/veiculos/domain/entities/veiculo.entity';

describe('ConsultarDividaVeiculoCasoDeUso', () => {
    let casoDeUso: ConsultarDividaVeiculoCasoDeUso;
    let veiculoRepositorio: jest.Mocked<VeiculoRepositorio>;
    let cacheServico: jest.Mocked<CacheServico>;
    let rabbitMQServico: jest.Mocked<RabbitMQServico>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ConsultarDividaVeiculoCasoDeUso,
          {
            provide: 'VeiculoRepositorio',
            useValue: {
              buscarPorPlaca: jest.fn(),
            },
          },
          {
            provide: CacheServico,
            useValue: {
              obterCache: jest.fn(),
              armazenarCache: jest.fn(),
            },
          },
          {
            provide: RabbitMQServico,
            useValue: {
              sendMessage: jest.fn(),
            },
          },
        ],
      }).compile();
  
      casoDeUso = module.get<ConsultarDividaVeiculoCasoDeUso>(ConsultarDividaVeiculoCasoDeUso);
      veiculoRepositorio = module.get<VeiculoRepositorio>('VeiculoRepositorio') as jest.Mocked<VeiculoRepositorio>;
      cacheServico = module.get<CacheServico>(CacheServico) as jest.Mocked<CacheServico>;
      rabbitMQServico = module.get<RabbitMQServico>(RabbitMQServico) as jest.Mocked<RabbitMQServico>;
    });
  
    it('deve retornar o veículo do cache se estiver presente', async () => {
      const placa = 'ABC1234';
      const veiculo = {
        placa,
        multas: 0,
        ipva: 0,
        idProprietario: '123',
      };
      cacheServico.obterCache.mockResolvedValueOnce(JSON.stringify(veiculo));
  
      const resultado = await casoDeUso.executar(placa);
  
      expect(cacheServico.obterCache).toHaveBeenCalledWith(`veiculo-divida-${placa}`);
      expect(resultado).toEqual(expect.objectContaining(veiculo));
    });
  
    it('deve buscar o veículo no repositório se não estiver no cache e armazenar no cache', async () => {
      const placa = 'DEF5678';
      const veiculo = {
        placa,
        multas: 0,
        ipva: 0,
        idProprietario: '123',
      };
      cacheServico.obterCache.mockResolvedValueOnce(null);
      veiculoRepositorio.buscarPorPlaca.mockResolvedValueOnce(veiculo as Veiculo);
  
      const resultado = await casoDeUso.executar(placa);
  
      expect(cacheServico.obterCache).toHaveBeenCalledWith(`veiculo-divida-${placa}`);
      expect(veiculoRepositorio.buscarPorPlaca).toHaveBeenCalledWith(placa);
      expect(cacheServico.armazenarCache).toHaveBeenCalledWith(`veiculo-divida-${placa}`, JSON.stringify(veiculo));
      expect(resultado).toEqual(expect.objectContaining(veiculo));
    });
  
    it('deve lançar uma exceção se o veículo não for encontrado', async () => {
      const placa = 'GHI9012';
      cacheServico.obterCache.mockResolvedValueOnce(null);
      veiculoRepositorio.buscarPorPlaca.mockResolvedValueOnce(null);
  
      await expect(casoDeUso.executar(placa)).rejects.toThrow(NotFoundException);
      expect(veiculoRepositorio.buscarPorPlaca).toHaveBeenCalledWith(placa);
    });
  
    it('deve enviar uma mensagem ao RabbitMQ após buscar o veículo', async () => {
      const placa = 'JKL3456';
      const veiculo = {
        placa,
        multas: 0,
        ipva: 0,
        idProprietario: '123',
      };
      cacheServico.obterCache.mockResolvedValueOnce(null);
      veiculoRepositorio.buscarPorPlaca.mockResolvedValueOnce(veiculo as Veiculo);
  
      await casoDeUso.executar(placa);
  
      expect(rabbitMQServico.sendMessage).toHaveBeenCalledWith(
        'veiculos',
        'consultas_divida_veiculo',
        expect.objectContaining({ placa })
      );
    });
  });
  
