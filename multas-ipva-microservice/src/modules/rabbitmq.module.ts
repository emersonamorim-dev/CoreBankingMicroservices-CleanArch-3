import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQServico } from 'src/veiculos/infrastructure/messaging/rabbitmq.servico';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',  
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ, 
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')],  
            queue: 'multas_ipva_queue',  
            queueOptions: {
              durable: false,  
            },
          },
        }),
      },
    ]),
  ],
  providers: [RabbitMQServico],  
  exports: [ClientsModule, RabbitMQServico],  
})
export class RabbitMQModule {}
