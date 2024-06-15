import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from 'src/confs/env.confs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { WinstonEnvs } from 'src/consts';
import { ApiModule } from 'src/common/utils/api/api.module';
import { StringUtilModule } from 'src/common/utils/string/string-util.module';
import { DefaultParamsMiddleware } from 'src/common/middlewares/default-params.middleware';
import { applyOtherMiddlewares } from 'src/common/middlewares';
import { PrismaModule } from 'src/common/db/prisma/prisma.module';
import { SSOModule } from 'src/common/utils/api/sso/sso.module';
import { HttpServiceUtilModule } from 'src/common/utils/httpService/http-service-util.module';
import { BlogModule } from './blog/blog.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      expandVariables: true,
      validationSchema,
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get(WinstonEnvs.THROTTLE_TTL),
          limit: config.get(WinstonEnvs.THROTTLE_LIMIT),
        },
      ],
    }),
    PrismaModule,
    UserModule,
    ApiModule,
    StringUtilModule,
    SSOModule,
    HttpServiceUtilModule,
    BlogModule,
    TagModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyOtherMiddlewares(consumer);
    consumer.apply(DefaultParamsMiddleware).forRoutes('*');
  }
}
