import { RequestMethod } from '@nestjs/common';
import { Request as RequestExpress } from 'express';
type HttpMethod = keyof typeof RequestMethod;

interface Request extends RequestExpress {
  user: any;
}

export { HttpMethod, Request };
