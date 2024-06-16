import { INestApplication } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { StringUtilService } from '../utils/string/string-util.service';
import { EnvVars, HttpHeaders } from 'src/consts';
import { ConfigService } from '@nestjs/config';
export default function setHeadersMiddleware(app: INestApplication) {
  return (req: Request, res: Response, next: NextFunction) => {
    const headers = req.headers;
    const stringUtilService = app.get(StringUtilService);
    const configService = app.get(ConfigService);
    const instance = {
      [HttpHeaders.REQUEST_ID]:
        headers[HttpHeaders.REQUEST_ID] ?? stringUtilService.genRandom(),
      [HttpHeaders.VERSION]:
        headers[HttpHeaders.VERSION] ?? configService.get(EnvVars.API_VERSION),
    };
    for (const [key, value] of Object.entries(instance)) {
      req.headers[key] = value;
    }
    next();
  };
}
