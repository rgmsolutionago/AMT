import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';


import { environment } from '../../environments/environment';

import { Observable } from 'rxjs';

interface KeyValuePair {
    [key: string]: any;
}

interface HttpOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

export class RestBaseService<T> {

    protected url = this.baseUrl;
    private readonly httpHeaders: KeyValuePair = {
        'Content-Type': 'application/json'
    };

    constructor(
        protected http: HttpClient,
        protected readonly baseUrl: string
    ) { }
    
    protected getMany(subRoute: string = '', query?: KeyValuePair): Observable<T[]> {
        return this.http.get<T[]>(`${this.url}/${subRoute}`, this.getHttpOptions(query));
    }

    protected get(subRoute: string = '', query?: KeyValuePair): Observable<T> {
        return this.http.get<T>(`${this.url}/${subRoute}`, this.getHttpOptions(query));
    }

    protected getById(id: string, subRoute: string = '', query?: KeyValuePair): Observable<T> {
        return this.http.get<T>(`${this.url}/${id}/${subRoute}`, this.getHttpOptions(query));
    }

    protected post(body: any, subRoute: string = '', query?: KeyValuePair): Observable<T> {
        return this.http.post<T>(`${this.url}/${subRoute}`, body, this.getHttpOptions(query));
    }
    
    protected put(body: any, subRoute: string = '', query?: KeyValuePair): Observable<T> {
        return this.http.put<T>(`${this.url}/${subRoute}`, body, this.getHttpOptions(query));
    }

    protected putById(id: string, body: any, subRoute: string = '', query?: KeyValuePair): Observable<T> {
        return this.http.put<T>(`${this.url}/${id}/${subRoute}`, body, this.getHttpOptions(query));
    }

    protected delete(id: string, subRoute: string = '', query?: KeyValuePair): Observable<T> {
        return this.http.delete<T>(`${this.url}/${id}/${subRoute}`, this.getHttpOptions(query));
    }

    protected getHttpOptions(query?: KeyValuePair): HttpOptions {
        const headers = new HttpHeaders(this.httpHeaders);
        let params: HttpParams;
        if (query && Object.keys(query).length)
            params = new HttpParams({ fromObject: query });
        return { headers, params };
    }
}
