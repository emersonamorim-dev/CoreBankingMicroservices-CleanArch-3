import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi'; 

@Module({
  imports: [
    // ConfigModule para carregar variáveis de ambiente a partir do .env
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(), 
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), 
      }),
    }),
  ],
})
export class AppModule {}
