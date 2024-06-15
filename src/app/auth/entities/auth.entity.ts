import { PickType } from '@nestjs/mapped-types';
import { SSO } from 'src/common/utils/api/sso/sso.entity';

export class Auth extends PickType(SSO, ['token']) {}
