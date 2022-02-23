import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { HttpService } from '../../core/services/http.service';

@Injectable()
export class SearchService<T> {

  private searchFields: (keyof T | string)[] = [];

  constructor(private http: HttpService) {
  }

  setFields(fields: (keyof T | string)[]) {
    this.searchFields = this.searchFields.concat(fields);
  }

  find(searchTerm: string | number, model?: Subject<T[]> | null, route?: string): Observable<T[]> {
    if (this.searchFields.length == 0) {
      throw new Error('Search fields not provided')
    }

    let hits: Observable<T[]> = new Observable<T[]>();

    //if there is a route, search the backend
    if (route) {
      hits = this.http.get(route, {withoutToken: true, params: {search: searchTerm},});
    } else if (model) {
      hits = model.pipe(map((rows: T[]) => {

        return rows.filter((row: any) => {
          return this.searchFields
            .some((field) => this.hasHit(String(searchTerm).toLowerCase(), row, field));
        });
      }));
    }

    return hits;
  }

  hasHit(searchTerm: string, dataRow: any[], field: any): boolean {
    const keyDelimiter = '.';
    let nestedKey: string[] = [];
    const isNested = (field as string).includes(keyDelimiter);


    if (isNested) {
      nestedKey = (field as string).split(keyDelimiter);
      field = nestedKey.shift();//remove the first field key
    }

    //if field is not provided or no field in the row
    if (!field || !dataRow[ field ]) {
      return false
    }


    if (isNested) {

      if (typeof dataRow[ field ] === 'object' && keyDelimiter.length > 0) {
        //recursive call
        return this.hasHit(searchTerm, dataRow[ field ], nestedKey.join(keyDelimiter))
      } else if (Array.isArray(dataRow[ field ])) {
        return (dataRow[ field ]).some((v: any) => String(v).toLowerCase().includes(searchTerm));
      }
      //it's safe to assume this is impossible
      return false;
    }
    if (typeof dataRow[ field ] === 'string' || typeof dataRow[ field ] === 'boolean'
      || typeof dataRow[ field ] === 'number' || typeof dataRow[ field ] === 'bigint') {

      return String(dataRow[ field ]).toLowerCase().includes(searchTerm)
    }

    return false;
  }
}
