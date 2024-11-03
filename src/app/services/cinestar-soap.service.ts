import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgxSoapService, Client, ISoapMethodResponse } from 'ngx-soap';
import { Observable } from 'rxjs';
import { AppConfig } from '../app.config';

@Injectable()
export class CinestarSoapService {
  infoClient: Client;
  transClient: Client;
  theatreID: number;
  theatreGroupID: number;
  atmFilter: string;
  productsFilter: string;
  workstationId: number;

  constructor(private _soap: NgxSoapService) {
    this.theatreGroupID = AppConfig.settings.theatreGroupID;
    this.theatreID = AppConfig.settings.theatreID;
    this.atmFilter = AppConfig.settings.atmFilter;
    this.workstationId = AppConfig.settings.workstationId;
    this.productsFilter = AppConfig.settings.productsFilter;
  }

  async initInfo(): Promise<void> {
    const infoClient = await this._soap.createClient(AppConfig.settings.remote.info);
    this.infoClient = infoClient;
  }

  async initTrans(): Promise<void> {
    const transClient = await this._soap.createClient(AppConfig.settings.remote.trans);
    this.transClient = transClient;
  }

  get<T>(client: Client, method: string, params: any): Observable<T[]> {
    return this.getRaw(client, method, params).pipe(map(x => this.extract(x as ISoapMethodResponse)));
  }

  getOne<T>(client: Client, method: string, params: any): Observable<T> {
    return this.getRaw(client, method, params).pipe(map(x => this.extract(x as ISoapMethodResponse)));
  }

  getRaw(client: Client, method: string, params: any) {
    return (<any>client)[method](params);
  }

  getBlob(client: Client, method: string, params: any) {
    client.addHttpHeader('responseType', 'blob');
    return (<any>client)[method](params);
  }

  private extract<T>(res: ISoapMethodResponse): T[] {
    const key = Object.keys(res!.result)[0];
    return (res && res.result && (res.result[key].root === undefined ? res.result[key] : res.result[key].root)) || null;
  }
}
