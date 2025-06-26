import { Controller, Get } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

@Controller('health')
export class HealthController {
  @Get()
  @Throttle({ default: { limit: 100, ttl: 60000 } })
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
