import { PickType } from '@nestjs/mapped-types';
import { SSO } from 'src/common/utils/api/sso/sso.entity';

export class User extends PickType(SSO, ['token']) {}
