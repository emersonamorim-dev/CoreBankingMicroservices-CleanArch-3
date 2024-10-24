import { Test, TestingModule } from '@nestjs/testing';
import { VeiculoController } from '@src/veiculos/presentation/controllers/veiculo.controller';
import { VeiculoServico } from '@src/veiculos/application/services/veiculo-service';
import { CriarVeiculoDto } from '@src/veiculos/presentation/dto/criar-veiculo.dto';
import { HttpStatus, HttpException } from '@nestjs/common';

describe('VeiculoController', () => {
  let veiculoController: VeiculoController;
  let veiculoServico: VeiculoServico;

  const mockVeiculoServico = {
    criarVeiculo: jest.fn(),
    consultarVeiculo: jest.fn(),
    parcelarDivida: jest.fn(),
    obterNumeroConsultas: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeiculoController],
      providers: [
        {
          provide: VeiculoServico,
          useValue: mockVeiculoServico, // mocks para simular as funções do serviço
        },
      ],
    }).compile();

    veiculoController = module.get<VeiculoController>(VeiculoController);
    veiculoServico = module.get<VeiculoServico>(VeiculoServico);
  });

  afterEach(() => {
    jest.clearAllMocks(); 
  });

  // Teste para o método "criarVeiculo"
  describe('criarVeiculo', () => {
    it('deve criar um veículo com sucesso', async () => {
      const criarVeiculoDto: CriarVeiculoDto = {
        placa: 'ABC1234',
        multas: 500,
        ipva: 300,
        idProprietario: '1234567890',  
      };
      const mockResult = {
        placa: 'ABC1234',
        multas: 500,
        ipva: 300,
        dividaTotal: 800,
        idProprietario: '1234567890',
      };
      mockVeiculoServico.criarVeiculo.mockResolvedValue(mockResult);

      const response = await veiculoController.criarVeiculo(criarVeiculoDto);

      expect(response).toEqual({
        status: HttpStatus.OK,
        data: mockResult,
      });
      expect(mockVeiculoServico.criarVeiculo).toHaveBeenCalledWith(criarVeiculoDto);
    });

    it('deve lançar um erro ao criar um veículo', async () => {
      const criarVeiculoDto: CriarVeiculoDto = {
        placa: 'ABC1234',
        multas: 500,
        ipva: 300,
        idProprietario: '1234567890',  
      };
      mockVeiculoServico.criarVeiculo.mockRejectedValue(new Error('Erro ao criar veículo'));

      await expect(veiculoController.criarVeiculo(criarVeiculoDto)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Erro ao criar veículo' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  // Teste para o método "consultarVeiculo"
  describe('consultarVeiculo', () => {
    it('deve consultar um veículo com sucesso', async () => {
      const mockResult = {
        placa: 'ABC1234',
        multas: 500,
        ipva: 300,
        dividaTotal: 800,
        idProprietario: '1234567890',
      };
      mockVeiculoServico.consultarVeiculo.mockResolvedValue(mockResult);

      const response = await veiculoController.consultarVeiculo('ABC1234');

      expect(response).toEqual({
        status: HttpStatus.OK,
        data: mockResult,
      });
      expect(mockVeiculoServico.consultarVeiculo).toHaveBeenCalledWith('ABC1234');
    });

    it('deve lançar um erro ao consultar um veículo', async () => {
      mockVeiculoServico.consultarVeiculo.mockRejectedValue(new Error('Veículo não encontrado'));

      await expect(veiculoController.consultarVeiculo('ABC1234')).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Veículo não encontrado' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  // Teste para o método "parcelarDivida"
  describe('parcelarDivida', () => {
    it('deve parcelar a dívida de um veículo com sucesso', async () => {
      const mockResult = {
        placa: 'ABC1234',
        dividaTotal: 800,
        numeroParcelas: 12,
        valorParcela: 66.67,
        formasPagamento: ['Cartão de Crédito', 'Cartão de Débito', 'Pix'],
        idProprietario: '1234567890',
      };
      mockVeiculoServico.parcelarDivida.mockResolvedValue(mockResult);

      const response = await veiculoController.parcelarDivida('ABC1234', 12);

      expect(response).toEqual({
        status: HttpStatus.OK,
        data: mockResult,
      });
      expect(mockVeiculoServico.parcelarDivida).toHaveBeenCalledWith('ABC1234', 12);
    });

    it('deve lançar um erro ao tentar parcelar uma dívida', async () => {
      mockVeiculoServico.parcelarDivida.mockRejectedValue(new Error('Erro ao parcelar dívida'));

      await expect(veiculoController.parcelarDivida('ABC1234', 12)).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Erro ao parcelar dívida' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  // Teste para o método "obterNumeroConsultas"
  describe('obterNumeroConsultas', () => {
    it('deve obter o número de consultas com sucesso', async () => {
      const mockResult = 5;
      mockVeiculoServico.obterNumeroConsultas.mockResolvedValue(mockResult);

      const response = await veiculoController.obterNumeroConsultas('ABC1234');

      expect(response).toEqual({
        status: HttpStatus.OK,
        data: { placa: 'ABC1234', numeroConsultas: mockResult },
      });
      expect(mockVeiculoServico.obterNumeroConsultas).toHaveBeenCalledWith('ABC1234');
    });

    it('deve lançar um erro ao obter o número de consultas', async () => {
      mockVeiculoServico.obterNumeroConsultas.mockRejectedValue(new Error('Erro ao obter consultas'));

      await expect(veiculoController.obterNumeroConsultas('ABC1234')).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Erro ao obter consultas' },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
