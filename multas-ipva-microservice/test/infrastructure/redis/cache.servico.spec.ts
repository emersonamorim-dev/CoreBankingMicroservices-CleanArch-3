import { Test, TestingModule } from '@nestjs/testing';
import { CacheServico } from '@src/veiculos/infrastructure/redis/cache.servico';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Logger } from '@nestjs/common';

jest.mock('ioredis', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      get: jest.fn(),
      incr: jest.fn(),
      on: jest.fn(),
      quit: jest.fn(),
    })),
  };
});

describe('CacheServico', () => {
  let cacheServico: CacheServico;
  let configService: ConfigService;
  let redisClient: jest.Mocked<Redis>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheServico,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'REDIS_HOST') return 'localhost';
              if (key === 'REDIS_PORT') return 6379;
              return null;
            }),
          },
        },
      ],
    }).compile();

    cacheServico = module.get<CacheServico>(CacheServico);
    configService = module.get<ConfigService>(ConfigService);
    redisClient = (cacheServico as any).redisClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('constructor', () => {
    it('deve inicializar o Redis com os valores de configuracao corretos', () => {
      expect(Redis).toHaveBeenCalledWith({ host: 'localhost', port: 6379 });
    });

    it('deve logar uma mensagem de conexão bem-sucedida', () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');
      new CacheServico(configService);
      expect(loggerSpy).toHaveBeenCalledWith('Conectado ao Redis na host localhost e porta 6379');
    });
  });

  describe('armazenarCache', () => {
    it('deve armazenar um valor no cache com a chave correta', async () => {
      await cacheServico.armazenarCache('testKey', { valor: 123 });
      expect(redisClient.set).toHaveBeenCalledWith('testKey', JSON.stringify({ valor: 123 }));
    });
  
    it('deve logar erro ao falhar ao armazenar cache', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      redisClient.set.mockRejectedValueOnce(new Error('Erro de armazenamento'));
      try {
        await cacheServico.armazenarCache('testKey', { valor: 123 });
      } catch (error) {
        expect(loggerSpy).toHaveBeenCalledWith('Erro ao armazenar no cache com a chave testKey: Erro de armazenamento');
      }
    });
  });
  
  describe('obterCache', () => {
    it('deve obter um valor do cache pela chave correta', async () => {
      redisClient.get.mockResolvedValueOnce(JSON.stringify({ valor: 123 }));
      const result = await cacheServico.obterCache('testKey');
      expect(result).toEqual({ valor: 123 });
      expect(redisClient.get).toHaveBeenCalledWith('testKey');
    });
  
    it('deve retornar null se não houver valor no cache', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      const result = await cacheServico.obterCache('testKey');
      expect(result).toBeNull();
    });
  
    it('deve logar erro ao falhar ao obter cache', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      redisClient.get.mockRejectedValueOnce(new Error('Erro ao obter cache'));
      try {
        await cacheServico.obterCache('testKey');
      } catch (error) {
        expect(loggerSpy).toHaveBeenCalledWith('Erro ao obter dado do cache com a chave testKey: Erro ao obter cache');
      }
    });
  });
  
  describe('incrementarNumeroConsultas', () => {
    it('deve incrementar o número de consultas para a placa', async () => {
      await cacheServico.incrementarNumeroConsultas('ABC1234');
      expect(redisClient.incr).toHaveBeenCalledWith('ABC1234');
    });
  
    it('deve logar erro ao falhar ao incrementar consultas', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      redisClient.incr.mockRejectedValueOnce(new Error('Erro ao incrementar'));
      try {
        await cacheServico.incrementarNumeroConsultas('ABC1234');
      } catch (error) {
        expect(loggerSpy).toHaveBeenCalledWith('Erro ao incrementar consultas para a placa ABC1234: Erro ao incrementar');
      }
    });
  });
  
  describe('obterNumeroConsultas', () => {
    it('deve retornar o número de consultas para uma placa', async () => {
      redisClient.get.mockResolvedValueOnce('5');
      const result = await cacheServico.obterNumeroConsultas('ABC1234');
      expect(result).toBe(5);
      expect(redisClient.get).toHaveBeenCalledWith('ABC1234');
    });
  
    it('deve retornar 0 se não houver valor para a placa', async () => {
      redisClient.get.mockResolvedValueOnce(null);
      const result = await cacheServico.obterNumeroConsultas('ABC1234');
      expect(result).toBe(0);
    });
  
    it('deve logar erro ao falhar ao obter o número de consultas', async () => {
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');
      redisClient.get.mockRejectedValueOnce(new Error('Erro ao obter consultas'));
      try {
        await cacheServico.obterNumeroConsultas('ABC1234');
      } catch (error) {
        expect(loggerSpy).toHaveBeenCalledWith('Erro ao obter o número de consultas para a placa ABC1234: Erro ao obter consultas');
      }
    });
    });
  });