import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'pagination[meta]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() meta: { page: number, limit: number, total: number }
  @Output() pageChange = new EventEmitter<number>()

  constructor() {
    this.meta = {
      page: 1,
      limit: 15,
      total: 0
    }
  }

  ngOnInit(): void {
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  get currentPageStartCount() {
    const actual = (this.meta.limit * this.meta.page) - this.meta.limit + 1;
    return actual < this.meta.total ? actual : this.meta.total;
  }

  get currentPageStopCount() {
    const actual = this.meta.page * this.meta.limit;
    return this.meta.limit < this.meta.total && actual < this.meta.total ? actual : this.meta.total;
  }
}
