import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {
  private keyDelimiter = '.';

  transform<T>(model: Array<T>, searchTerm: string, searchFields?: string[]): Array<T> {
    if (!searchTerm || !searchTerm.trim() || !model || !Array.isArray(model)) {
      return model;
    }

    return model.filter((row) => {
      return this.hasHit(searchTerm.trim().toLowerCase(), row, searchFields)
    });
  }

  hasHit(searchTerm: string, row: any, keys?: string[]): boolean {
    if (typeof row === 'string') { //if it's a string
      return row.toString().includes(searchTerm);
    }

    //if there are search keys
    if (keys) {
      return keys.some((key) => {
        let tempKey: string = key;

        let nestedKeys: string[] | undefined = undefined;
        if (key.includes(this.keyDelimiter)) {

          nestedKeys = (key as string).split(this.keyDelimiter);

          tempKey = (nestedKeys as string[]).shift() as string;//remove the first field key
        }

        //if key is null or no field with such key in the row,
        if (!tempKey || !row[ tempKey ]) {
          return false
        }

        //if is an object
        if (typeof row[ tempKey ] === 'object') {
          return this.hasHit(searchTerm, row[ tempKey ], nestedKeys ? nestedKeys : undefined);
        }

        return String(row[ tempKey ]).toLowerCase().includes(searchTerm)
      });
    }

    //if there are no keys, go through each object

    return Object.keys(row)
      .some((key) => {
        if (!row[ key ] || typeof row[ key ] === 'function') {
          return false;
        }
        if (typeof row[ key ] === 'object') {
          return this.hasHit(searchTerm, row[ key ]);
        }

        return String(row[ key ]).toLowerCase().includes(searchTerm);

      });

  }
}
