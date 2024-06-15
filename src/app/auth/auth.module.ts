import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SSOModule } from 'src/common/utils/api/sso/sso.module';

@Module({
  imports: [SSOModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
