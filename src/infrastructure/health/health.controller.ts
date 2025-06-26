import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @ApiOperation({ summary: 'Verificar saúde da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'Status da aplicação',
    example: {
      status: 'ok',
      timestamp: '2024-01-01T00:00:00.000Z',
      uptime: 123.456,
      environment: 'development',
      service: 'challenge-nestjs',
      checks: {
        memory: {
          rss: '50.5 MB',
          heapTotal: '30.2 MB',
          heapUsed: '25.1 MB',
          external: '25.1 MB',
        },
        system: {
          platform: 'darwin',
          nodeVersion: 'v18.0.0',
          cpuArchitecture: 'x64',
        },
      },
    },
  })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      service: 'challenge-nestjs',
      checks: {
        memory: this.getMemoryUsage(),
        system: this.getSystemInfo(),
      },
    };
  }

  private getMemoryUsage() {
    const memUsage = process.memoryUsage();
    return {
      rss: `${memUsage.rss / 1024 / 1024} MB`,
      heapTotal: `${memUsage.heapTotal / 1024 / 1024} MB`,
      heapUsed: `${memUsage.heapUsed / 1024 / 1024} MB`,
      external: `${memUsage.heapUsed / 1024 / 1024} MB`,
    };
  }

  private getSystemInfo() {
    return {
      platform: process.platform,
      nodeVersion: process.version,
      cpuArchitecture: process.arch,
    };
  }
}
