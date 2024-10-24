import { Injectable, Logger } from '@nestjs/common';
import { Counter } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class LoggerGrafanaService {
  private readonly logger = new Logger(LoggerGrafanaService.name);

  constructor(
    @InjectMetric('logs_total') private readonly logsCounter: Counter<string>,
  ) {}

  logInfo(message: string): void {
    this.logsCounter.inc();
    this.logger.log(message);
  }

  logError(message: string, trace?: string): void {
    this.logsCounter.inc();
    this.logger.error(message, trace);
  }

  logWarn(message: string): void {
    this.logsCounter.inc();
    this.logger.warn(message);
  }

  logDebug(message: string): void {
    this.logsCounter.inc();
    this.logger.debug(message);
  }
}
