import { Injectable, Inject } from '@nestjs/common';
import { Counter } from 'prom-client';

@Injectable()
export class MonitoramentoServico {
  constructor(
    @Inject('consultas_veiculo_total') private readonly consultasVeiculoCounter: Counter, 
  ) {}

  incrementarConsultas(): void {
    this.consultasVeiculoCounter.inc();  
  }
}
