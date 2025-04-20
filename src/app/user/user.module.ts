import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/common/db/prisma/prisma.service';
import { SSOModule } from 'src/common/utils/api/sso/sso.module';
@Module({
  imports: [SSOModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
