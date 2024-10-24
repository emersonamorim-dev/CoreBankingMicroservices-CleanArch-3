import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';  
import rateLimit from 'express-rate-limit';  


async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule);
  

  app.enableCors();

  //app.use(helmet());

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "cdn.jsdelivr.net"],
          scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
          styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        },
      },
    }),
  );

  // Limita requisições para prevenir ataques de força bruta
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Limite de 100 requisições por IP
      message: 'Muitas requisições criadas a partir deste IP, tente novamente mais tarde.',
    }),
  );



  // Habilita o ValidationPipe globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  // Configuração da porta
  const port = process.env.PORT ?? 8018;

  await app.listen(port);
  logger.log(`Aplicação rodando na porta ${port}`);
}

bootstrap();
