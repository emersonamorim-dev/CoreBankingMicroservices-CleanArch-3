import { IsString, IsNumber } from 'class-validator';

export class CriarVeiculoDto {
  @IsString()
  placa: string;

  @IsNumber()
  multas: number;

  @IsNumber()
  ipva: number;

  @IsString()
  idProprietario: string;  
}
