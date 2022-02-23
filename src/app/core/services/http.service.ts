import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpService {
  private baseUrl: string;

  constructor(private httpClient: HttpClient, private storageService: StorageService) {
    this.baseUrl = environment.app.apiUrl;

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
  put(uri: string, payload: JSON, httpOptions?: {}): Observable<any> {

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
  private buildHttpOptions(options?: HTTPOptions): HTTPOptions {

    let headers: { [ key: string ]: string | number } = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    if (!options?.withoutToken) {
      headers = {...headers, ...{Authorization: `Bearer ${this.storageService.token}`}};
    }

    let obj: HTTPOptions = {
      withoutToken: false,
      headers: headers,
      params: {},
      withCredentials: false,
      responseType: 'json'
    };

    if (options) {
      obj = {...obj, ...options}
      delete obj?.withoutToken;
    }

    return obj;
  }

}


export class HTTPOptions {
  withoutToken?: boolean;
  headers?: {};
  params ?: {};
  withCredentials ?: boolean;
  responseType ?: any;
}

