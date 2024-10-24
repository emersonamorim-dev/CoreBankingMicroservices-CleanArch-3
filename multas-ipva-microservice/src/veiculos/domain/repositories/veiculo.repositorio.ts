import { Veiculo } from "../entities/veiculo.entity";

export interface VeiculoRepositorio {
  buscarPorPlaca(placa: string): Promise<Veiculo>;
  criarVeiculo(veiculo: Veiculo): Promise<Veiculo>;  
  adicionarConsulta(placa: string): Promise<void>;
  obterNumeroConsultas(placa: string): Promise<number>;
}
