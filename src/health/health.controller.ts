import { Controller, Get, Inject } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { ConfigType } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import serverConfig from '../config/server.config';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly microservice: MicroserviceHealthIndicator,
    @Inject(serverConfig.KEY)
    private readonly serverConf: ConfigType<typeof serverConfig>,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return from(
      this.health.check([
        () =>
          this.microservice.pingCheck('tcp', {
            transport: Transport.TCP,
            options: { host: 'localhost', port: this.serverConf.port },
          }),
      ]),
    ).pipe(
      map((indicators) => ({
        ...indicators,
        version: this.serverConf.version,
      })),
    );
  }
}
