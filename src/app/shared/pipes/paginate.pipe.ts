import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  pure: false
})

export class PaginatePipe<T> implements PipeTransform {

  transform(data: T[], meta: { page: number, limit: number, total: number }): T[] {
    meta.total = data.length;
    return data.slice((meta.page - 1) * meta.limit, meta.page * meta.limit);
  }
}
