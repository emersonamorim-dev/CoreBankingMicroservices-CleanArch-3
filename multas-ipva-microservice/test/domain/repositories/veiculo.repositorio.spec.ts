import { Test, TestingModule } from '@nestjs/testing';
import { Veiculo } from '@src/veiculos/domain/entities/veiculo.entity';
import { VeiculoRepositorio } from '@src/veiculos/domain/repositories/veiculo.repositorio';

describe('VeiculoRepositorio', () => {
  let veiculoRepositorio: VeiculoRepositorio;

  const mockVeiculoRepositorio = {
    buscarPorPlaca: jest.fn(),
    criarVeiculo: jest.fn(),
    adicionarConsulta: jest.fn(),
    obterNumeroConsultas: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          // Usei um token para representar o VeiculoRepositorio, pois ele é uma interface
          provide: 'VeiculoRepositorio',
          useValue: mockVeiculoRepositorio, // Simulei o comportamento da interface com jest
        },
      ],
    }).compile();

    // Injetei o mock usando o token 'VeiculoRepositorio'
    veiculoRepositorio = module.get<VeiculoRepositorio>('VeiculoRepositorio');
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  describe('buscarPorPlaca', () => {
    it('deve buscar um veículo pela placa com sucesso', async () => {
      const mockVeiculo = new Veiculo('ABC1234', 100, 200, '123456789');
      mockVeiculoRepositorio.buscarPorPlaca.mockResolvedValue(mockVeiculo);

      const result = await veiculoRepositorio.buscarPorPlaca('ABC1234');
      expect(result).toEqual(mockVeiculo);
      expect(mockVeiculoRepositorio.buscarPorPlaca).toHaveBeenCalledWith('ABC1234');
    });

    it('deve retornar null se o veículo não for encontrado', async () => {
      mockVeiculoRepositorio.buscarPorPlaca.mockResolvedValue(null);

      const result = await veiculoRepositorio.buscarPorPlaca('XYZ9876');
      expect(result).toBeNull();
      expect(mockVeiculoRepositorio.buscarPorPlaca).toHaveBeenCalledWith('XYZ9876');
    });

    it('deve lançar um erro se houver um problema ao buscar o veículo', async () => {
      mockVeiculoRepositorio.buscarPorPlaca.mockRejectedValue(new Error('Erro ao buscar veículo'));

      await expect(veiculoRepositorio.buscarPorPlaca('XYZ9876')).rejects.toThrow('Erro ao buscar veículo');
    });
  });

  describe('criarVeiculo', () => {
    it('deve criar um novo veículo com sucesso', async () => {
      const novoVeiculo = new Veiculo('DEF5678', 300, 400, '123456789');
      mockVeiculoRepositorio.criarVeiculo.mockResolvedValue(novoVeiculo);

      const result = await veiculoRepositorio.criarVeiculo(novoVeiculo);
      expect(result).toEqual(novoVeiculo);
      expect(mockVeiculoRepositorio.criarVeiculo).toHaveBeenCalledWith(novoVeiculo);
    });

    it('deve lançar um erro se houver falha ao criar o veículo', async () => {
      mockVeiculoRepositorio.criarVeiculo.mockRejectedValue(new Error('Erro ao criar veículo'));

      await expect(veiculoRepositorio.criarVeiculo(new Veiculo('DEF5678', 300, 400, '123456789')))
        .rejects.toThrow('Erro ao criar veículo');
    });
  });

  describe('adicionarConsulta', () => {
    it('deve incrementar o número de consultas com sucesso', async () => {
      mockVeiculoRepositorio.adicionarConsulta.mockResolvedValue(void 0);

      await veiculoRepositorio.adicionarConsulta('ABC1234');
      expect(mockVeiculoRepositorio.adicionarConsulta).toHaveBeenCalledWith('ABC1234');
    });

    it('deve lançar um erro se falhar ao incrementar o número de consultas', async () => {
      mockVeiculoRepositorio.adicionarConsulta.mockRejectedValue(new Error('Erro ao incrementar consultas'));

      await expect(veiculoRepositorio.adicionarConsulta('ABC1234')).rejects.toThrow('Erro ao incrementar consultas');
    });
  });

  describe('obterNumeroConsultas', () => {
    it('deve retornar o número de consultas de um veículo com sucesso', async () => {
      mockVeiculoRepositorio.obterNumeroConsultas.mockResolvedValue(5);

      const result = await veiculoRepositorio.obterNumeroConsultas('ABC1234');
      expect(result).toEqual(5);
      expect(mockVeiculoRepositorio.obterNumeroConsultas).toHaveBeenCalledWith('ABC1234');
    });

    it('deve lançar um erro se houver falha ao obter o número de consultas', async () => {
      mockVeiculoRepositorio.obterNumeroConsultas.mockRejectedValue(new Error('Erro ao contar consultas'));

      await expect(veiculoRepositorio.obterNumeroConsultas('ABC1234')).rejects.toThrow('Erro ao contar consultas');
    });
  });
});
