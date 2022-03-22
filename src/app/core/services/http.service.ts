import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { V1Endpoints } from '../../utils/api-endpoints';

@Injectable()
export class HttpService {
  private baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.baseUrl = environment.app.apiUrl;

  }

  get endpoint() {
    return V1Endpoints;
  }

  /**
   * Get a resource
   * @param uri : request URI
   * @param httpOptions : HTTPOptions such as headers to send with request
   */
  get(uri: string, httpOptions?: HTTPOptions): Observable<any> {
    return this.httpClient.get(this.baseUrl + uri, this.buildHttpOptions(httpOptions));
  }

  /**
   * Create a new resource using POST http method
   * @param uri : a URI for the resource access
   * @param payload  : key ~value pair of the data
   * @param httpOptions : HTTPOptions options such as headers to send with request
   */
  post(uri: string, payload: object, httpOptions?: HTTPOptions): Observable<any> {
    return this.httpClient.post(this.baseUrl + uri, payload, this.buildHttpOptions(httpOptions));
  }

  /**
   * Update a resource partially using PATCH http method
   * @param uri :the URI to the resource
   * @param payload : key ~ value pair data to update with
   * @param httpOptions : options such as headers
   */
  patch(uri: string, payload: object, httpOptions?: HTTPOptions): Observable<any> {
    return this.httpClient.patch(this.baseUrl + uri, payload, this.buildHttpOptions(httpOptions));
  }

  /**
   * Updating the whole record completely using PUT http method
   * @param uri :the uri to the resource
   * @param payload : key ~ value pair data to replace with
   * @param httpOptions : options such as request header
   */
  put(uri: string, payload: object, httpOptions?: HTTPOptions): Observable<any> {

    return this.httpClient.put(this.baseUrl + uri, payload, this.buildHttpOptions(httpOptions));
  }

  /**
   *  Delete http resource
   * @param  uri: URI to the resource
   * @param httpOptions: http request options
   */
  destroy(uri: string, httpOptions?: {}): Observable<any> {

    return this.httpClient.delete(this.baseUrl + uri, httpOptions);
  }


  /**
   * Build HTTP request options
   *
   */
  private buildHttpOptions = (options?: HTTPOptions): object => {

    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };


    let obj: HTTPOptions = {
      headers: headers,
      params: {},
      withCredentials: true,
      responseType: 'json'
    };

    if (options) {
      obj = {...obj, ...options}
    }

    return obj;
  };

}


interface HTTPOptions {
  headers?: HttpHeaders | { [ p: string ]: string | string[] };
  context?: HttpContext;
  params?: HttpParams |
    { [ param: string ]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  reportProgress?: boolean;
  withCredentials?: boolean;
  observe?: 'body' | 'events' | 'response';
  responseType?: 'json' | 'arraybuffer' | 'blob' | 'text';
}
