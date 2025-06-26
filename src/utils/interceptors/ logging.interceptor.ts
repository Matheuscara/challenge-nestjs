import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { tap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly http: HttpService) {}

  intercept(ctx: ExecutionContext, next: CallHandler) {
    if (ctx.getType() !== 'http') return next.handle();

    const req = ctx.switchToHttp().getRequest();
    const { method, url } = req;
    const id = uuid();
    const start = Date.now();

    this.logger.log(`→ [${id}] ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: () => this.after(ctx, id, start, method, url),
        error: (err) => this.after(ctx, id, start, method, url, err),
      }),
    );
  }

  private async after(
    ctx: ExecutionContext,
    id: string,
    start: number,
    method: string,
    url: string,
    error?: Error,
  ) {
    const res = ctx.switchToHttp().getResponse();
    const status = res.statusCode;
    const time = Date.now() - start;
    const line = `← [${id}] ${method} ${url} ${status} (${time} ms)`;

    error
      ? this.logger.error(`${line} – ${error.message}`)
      : this.logger.log(line);

    try {
      await this.sendToGrafana(line);
    } catch (e) {
      this.logger.warn(`Falha ao enviar log p/ Grafana: ${e.message}`);
    }
  }

  private sendToGrafana(msg: string) {
    const body = {
      streams: [
        {
          stream: { env: process.env.NODE_ENV ?? 'local' },
          values: [[`${Date.now()}000000`, msg]],
        },
      ],
    };

    return this.http
      .post(process.env.GRAFANA_URL!, body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .toPromise();
  }
}
