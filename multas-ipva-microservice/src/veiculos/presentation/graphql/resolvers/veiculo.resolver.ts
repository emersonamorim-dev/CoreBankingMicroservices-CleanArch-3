import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ConsultarDividaVeiculoCasoDeUso } from 'src/veiculos/application/usecases/consultar-divida-veiculo.caso-de-uso';
import { VeiculoType, ParcelamentoType } from '../veiculo.types';
import { VeiculoServico } from 'src/veiculos/application/services/veiculo-service';


@Resolver(() => VeiculoType)
export class VeiculoResolver {
  constructor(
    private readonly consultarDividaVeiculoCasoDeUso: ConsultarDividaVeiculoCasoDeUso,
    private readonly veiculoServico: VeiculoServico, 
  ) {}

  // Query para consultar a dívida do veículo via placa
  @Query(() => VeiculoType)
  async consultarDividaVeiculo(@Args('placa') placa: string): Promise<VeiculoType> {
    const veiculo = await this.consultarDividaVeiculoCasoDeUso.executar(placa);
    return {
      placa: veiculo.placa,
      multas: veiculo.multas,
      ipva: veiculo.ipva,
      dividaTotal: veiculo.obterDividaTotal(),
    };
  }

  // Query para obter o número de consultas de um veículo
  @Query(() => Number)
  async obterNumeroConsultas(@Args('placa') placa: string): Promise<number> {
    return this.veiculoServico.obterNumeroConsultas(placa);
  }

  // Mutation para parcelar a dívida do veículo
  @Mutation(() => ParcelamentoType)
  async parcelarDivida(
    @Args('placa') placa: string,
    @Args('numeroParcelas') numeroParcelas: number,
  ): Promise<ParcelamentoType> {
    const parcelamento = await this.veiculoServico.parcelarDivida(placa, numeroParcelas);
    return {
      placa: parcelamento.placa,
      dividaTotal: parcelamento.dividaTotal,
      numeroParcelas: parcelamento.numeroParcelas,
      valorParcela: parcelamento.valorParcela,
      formasPagamento: parcelamento.formasPagamento,
    };
  }
}
