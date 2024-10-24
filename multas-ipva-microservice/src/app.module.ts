import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import * as Joi from 'joi';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { AppService } from './app.service';
import { VeiculoEsquema } from './veiculos/infrastructure/schemas/veiculo.esquema';
import { VeiculoResolver } from './veiculos/presentation/graphql/resolvers/veiculo.resolver';
import { VeiculoServico } from './veiculos/application/services/veiculo-service';
import { CacheServico } from './veiculos/infrastructure/redis/cache.servico';
import { RedisModule } from './modules/redis.module';
import { RabbitMQModule } from './modules/rabbitmq.module';
import { ConsultarDividaVeiculoCasoDeUso } from './veiculos/application/usecases/consultar-divida-veiculo.caso-de-uso';
import { MongoVeiculoRepositorio } from './veiculos/domain/repositories/mongo-veiculo.repositorio'; 
import { VeiculoController } from './veiculos/presentation/controllers/veiculo.controller';

@Module({

  controllers: [VeiculoController], 


  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        RABBITMQ_URL: Joi.string().required(),
        PORT: Joi.number().default(8018),
      }),
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,  // Habilita o playground do GraphQL
      csrfPrevention: false,  // Desativa a proteção contra CSRF para o playground
    }),

    RedisModule,
    RabbitMQModule,

    MongooseModule.forFeature([{ name: 'Veiculo', schema: VeiculoEsquema }]),
  ],
  providers: [
    AppService,
    CacheServico,
    VeiculoServico,
    VeiculoResolver,
    ConsultarDividaVeiculoCasoDeUso,
    { provide: 'VeiculoRepositorio', useClass: MongoVeiculoRepositorio }, // Injeção do repositório
  ],
})
export class AppModule {}
