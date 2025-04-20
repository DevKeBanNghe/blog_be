import { INestApplication, VersioningType } from '@nestjs/common';
import { Environments, EnvVars, HttpHeaders } from './consts';
import { ConfigService } from '@nestjs/config';
import { initSwagger } from './confs/swagger.confs';

export const initApp = async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get(EnvVars.SERVER_PREFIX));
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: HttpHeaders.VERSION,
    defaultVersion: configService.get(EnvVars.API_VERSION),
  });
  app.enableCors({
    origin: [configService.get(EnvVars.FE_URL)],
    credentials: true,
  });

  const isDevelopment =
    configService.get(EnvVars.NODE_ENV) === Environments.DEVELOPMENT;
  if (isDevelopment) app = initSwagger(app);

  return app;
};
