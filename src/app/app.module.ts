import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validationSchema } from 'src/confs/env.confs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { WinstonEnvs } from 'src/consts';
import { ApiModule } from 'src/common/utils/api/api.module';
import { StringUtilModule } from 'src/common/utils/string/string-util.module';
import { applyMiddlewares } from 'src/common/middlewares';
import { PrismaModule } from 'src/common/db/prisma/prisma.module';
import { SSOModule } from 'src/common/utils/api/sso/sso.module';
import { HttpServiceUtilModule } from 'src/common/utils/httpService/http-service-util.module';
import { BlogModule } from './blog/blog.module';
import { TagModule } from './tag/tag.module';
import { AuthModule } from './auth/auth.module';
import { ImageModule } from './image/image.module';
import { FileUtilModule } from 'src/common/utils/file/file-util.module';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { AppService } from './app.service';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { AllExceptionFilter } from 'src/common/filters/all-exception.filter';
import { AccessControlGuard } from 'src/common/guards/access-control/access-control.guard';
import { ExcelUtilModule } from 'src/common/utils/excel/excel-util.module';
import { QueryUtilModule } from 'src/common/utils/query/query-util.module';

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
    HttpServiceUtilModule,
    UserModule,
    AuthModule,
    ApiModule,
    StringUtilModule,
    SSOModule,
    BlogModule,
    TagModule,
    ImageModule,
    FileUtilModule,
    ExcelUtilModule,
    QueryUtilModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessControlGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    applyMiddlewares(consumer);
  }
}
