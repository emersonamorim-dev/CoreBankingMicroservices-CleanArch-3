import { Controller, Get, Param, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { VeiculoServico } from '../../application/services/veiculo-service';
import { Veiculo } from '../../domain/entities/veiculo.entity';
import { CriarVeiculoDto } from '../dto/criar-veiculo.dto';

@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoServico: VeiculoServico) {}

  @Post()
  async criarVeiculo(@Body() criarVeiculoDto: CriarVeiculoDto) {
    try {
      const resultado = await this.veiculoServico.criarVeiculo(criarVeiculoDto);
      return {
        status: HttpStatus.OK,
        data: resultado,
      };
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  @Get(':placa')
  async consultarVeiculo(@Param('placa') placa: string) {
    try {
      const resultado = await this.veiculoServico.consultarVeiculo(placa);
      return {
        status: HttpStatus.OK,
        data: resultado,
      };
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':placa/parcelar')
  async parcelarDivida(
    @Param('placa') placa: string,
    @Body('numeroParcelas') numeroParcelas: number,
  ) {
    try {
      const resultado = await this.veiculoServico.parcelarDivida(placa, numeroParcelas);
      return {
        status: HttpStatus.OK,
        data: resultado,
      };
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':placa/consultas')
  async obterNumeroConsultas(@Param('placa') placa: string) {
    try {
      const resultado = await this.veiculoServico.obterNumeroConsultas(placa);
      return {
        status: HttpStatus.OK,
        data: { placa, numeroConsultas: resultado },
      };
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
