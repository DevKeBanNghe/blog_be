import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosInstance } from 'axios';
@Injectable()
export class HttpServiceUtilService {
  private _axios: AxiosInstance;
  constructor(private readonly httpService: HttpService) {
    this._axios = this.httpService.axiosRef;
  }

  get axios() {
    return this._axios;
  }

  set axios(value) {
    this._axios = value;
  }
}
