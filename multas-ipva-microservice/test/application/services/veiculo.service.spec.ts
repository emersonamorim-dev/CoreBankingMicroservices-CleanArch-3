import { Test, TestingModule } from '@nestjs/testing';
import { VeiculoServico } from '@src/veiculos/application/services/veiculo-service';
import { CacheServico } from '@src/veiculos/infrastructure/redis/cache.servico';
import { RabbitMQServico } from '@src/veiculos/infrastructure/messaging/rabbitmq.servico';
import { getModelToken } from '@nestjs/mongoose';
import { VeiculoDocumento } from 'src/veiculos/infrastructure/schemas/veiculo.esquema';
import { Model } from 'mongoose';
import { Veiculo } from '@src/veiculos/domain/entities/veiculo.entity';
import { CriarVeiculoDto } from '@src/veiculos/presentation/dto/criar-veiculo.dto';

describe('VeiculoServico', () => {
    let veiculoServico: VeiculoServico;
    let veiculoModel: Model<VeiculoDocumento>;
    let cacheServico: CacheServico;
    let rabbitMQServico: RabbitMQServico;

    const mockVeiculoModel = {
        create: jest.fn(),
        findOne: jest.fn(),
    };

    const mockCacheServico = {
        obterNumeroConsultas: jest.fn(),
        incrementarNumeroConsultas: jest.fn(),
    };

    const mockRabbitMQServico = {
        sendMessage: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VeiculoServico,
                { provide: getModelToken('Veiculo'), useValue: mockVeiculoModel },
                { provide: CacheServico, useValue: mockCacheServico },
                { provide: RabbitMQServico, useValue: mockRabbitMQServico },
            ],
        }).compile();

        veiculoServico = module.get<VeiculoServico>(VeiculoServico);
        veiculoModel = module.get<Model<VeiculoDocumento>>(getModelToken('Veiculo'));
        cacheServico = module.get<CacheServico>(CacheServico);
        rabbitMQServico = module.get<RabbitMQServico>(RabbitMQServico);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('criarVeiculo', () => {
        it('deve criar um veículo com sucesso e enviar uma mensagem para RabbitMQ', async () => {
            const criarVeiculoDto: CriarVeiculoDto = {
                placa: 'ABC1234',
                multas: 500,
                ipva: 300,
                idProprietario: '1234567890',
            };

            const veiculoSalvo = {
                placa: 'ABC1234',
                multas: 500,
                ipva: 300,
                idProprietario: '1234567890',
            };

            mockVeiculoModel.create.mockResolvedValue(veiculoSalvo);

            const result = await veiculoServico.criarVeiculo(criarVeiculoDto);

            expect(result).toEqual({
                placa: 'ABC1234',
                multas: 500,
                ipva: 300,
                idProprietario: '1234567890',
                dividaTotal: 800,
            });

            expect(mockVeiculoModel.create).toHaveBeenCalledWith(expect.any(Veiculo));
            expect(mockRabbitMQServico.sendMessage).toHaveBeenCalledWith(
                'veiculos',
                'veiculo.criado',
                expect.objectContaining({ placa: 'ABC1234', dividaTotal: 800 })
            );
        });

        it('deve lançar um erro se a criação do veículo falhar', async () => {
            const criarVeiculoDto: CriarVeiculoDto = {
                placa: 'ABC1234',
                multas: 500,
                ipva: 300,
                idProprietario: '1234567890',
            };

            mockVeiculoModel.create.mockRejectedValue(new Error('Erro ao salvar veículo'));

            await expect(veiculoServico.criarVeiculo(criarVeiculoDto)).rejects.toThrow('Erro ao salvar veículo');
        });
    });

    describe('parcelarDivida', () => {
      it('deve parcelar a dívida com sucesso', async () => {
          const veiculoDocumento = {
              placa: 'ABC1234',
              multas: 500,
              ipva: 300,
              idProprietario: '1234567890',
              exec: jest.fn().mockResolvedValue({
                  placa: 'ABC1234',
                  multas: 500,
                  ipva: 300,
                  idProprietario: '1234567890',
              }),
          };
  
          mockVeiculoModel.findOne.mockReturnValue(veiculoDocumento);
  
          const result = await veiculoServico.parcelarDivida('ABC1234', 12);
  
          expect(result).toEqual({
              placa: 'ABC1234',
              dividaTotal: 800,
              numeroParcelas: 12,
              valorParcela: 66.67, // Valor arredondado para 2 casas decimais
              formasPagamento: ['Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Pix'],
          });
      });
  });  
});
