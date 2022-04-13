import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { faEllipsisV, faExternalLinkAlt, faFilter } from '@fortawesome/free-solid-svg-icons';
import {
  ProductItemActivityCategoryCode,
  ProductItemActivityModel,
  ProductItemModel
} from '../../../../models/product-item.model';
import { WarehouseModel } from '../../../../models/warehouse.model';
import { PaginationModel } from '../../../../models/pagination.model';
import { ProductItemService } from '../../services/product-item.service';
import { serializeDate } from '../../../../utils/serializers/date';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  faEllipsisV = faEllipsisV;
  faFilter = faFilter;
  faExternalLinkAlt = faExternalLinkAlt;
  showLocationFormPopup = false;
  pagination: PaginationModel = {total: 0, page: 1, limit: 25};
  private _productItem?: ProductItemModel;
  private _activities: ProductItemActivityModel[] = [];
  private _subscriptions: Subscription[] = []
  private _warehouses: WarehouseModel[] = [];
  searchInput: FormControl;
  form: FormGroup;
  minAllowedWarrantEndDate?: string;

  constructor(private productItemService: ProductItemService, private _route: ActivatedRoute,
              private fb: FormBuilder) {

    this.loadActivities();

    this.searchInput = this.fb.control('');
    this.form = this.fb.group({
      category_code: this.fb.control('', {validators: [Validators.required]}),
      warrant_start: this.fb.control(null),
      warrant_end: this.fb.control(null),
      current_location: this.fb.control({value: '', disabled: true}),
      out_of_order: this.fb.control(null),
      customer: this.fb.control(null),
      warehouse: this.fb.control(null),
      description: this.fb.control(null, {validators: Validators.required}),
    });

    this.syncFormValidations()
    this.syncFormWarrantDates()
  }

  ngOnInit(): void {
    this.subSink = this.productItemService.findById(this._route.snapshot.params[ 'id' ])
      .subscribe({
        next: (v) => {
          this._productItem = v;
          this.form.patchValue({
            current_location: v.latest_activity?.location?.name,
            warrant_start: v?.active_warrant?.warrant_start,
            warrant_end: v?.active_warrant?.warrant_end
          })
        }
      });

    this.subSink = this.productItemService.fetchAllWarehouses
      .subscribe((v) => this._warehouses = v)
  }

  set subSink(value: Subscription) {
    this._subscriptions.push(value);
  }

  get tableCountStart() {
    return (this.pagination.page - 1) * this.pagination.limit
  }

  get tableCountEnd() {
    return this.pagination.page * this.pagination.limit
  }

  get activities() {
    return this._activities;
  }

  get productItem() {
    return this._productItem;
  }

  get warehouses() {
    return this._warehouses;
  }

  get updateCategories() {
    return [
      {code: ProductItemActivityCategoryCode.WARRANTY_UPDATE, title: 'Warranty Update'},
      {
        code: ProductItemActivityCategoryCode.CUSTOMER_TO_WAREHOUSE_TRANSFER,
        title: 'Customer to Warehouse Transfer'
      },
      {
        code: ProductItemActivityCategoryCode.CUSTOMER_TO_CUSTOMER_TRANSFER,
        title: 'Customer/Branch Transfer'
      },
    ]
  }

  get warrantyUpdateSelected() {
    return this.form.value.category_code &&
      this.form.value.category_code === ProductItemActivityCategoryCode.WARRANTY_UPDATE
  }

  get customer2WarehouseUpdateSelected() {
    return this.form.value.category_code &&
      this.form.value.category_code === ProductItemActivityCategoryCode.CUSTOMER_TO_WAREHOUSE_TRANSFER
  }

  get customer2CustomerUpdateSelected() {
    return this.form.value.category_code &&
      this.form.value.category_code === ProductItemActivityCategoryCode.CUSTOMER_TO_CUSTOMER_TRANSFER
  }

  get warehouse2WarehouseUpdateSelected() {
    return this.form.value.category_code &&
      this.form.value.category_code === ProductItemActivityCategoryCode.WAREHOUSE_TO_WAREHOUSE_TRANSFER
  }

  get route() {return this._route;}

  loadActivities() {
    if (this.tableCountEnd <= this._activities.length) {
      return;
    }
    this.subSink = this.productItemService.fetchActivities(
      this._route.snapshot.params[ 'id' ],
      this.pagination)
      .subscribe({
        next: (res) => {
          this.pagination.total = res.total;
          this._activities = this._activities.concat(res.data);
        }
      })
  }

  private syncFormValidations() {
    this.subSink = this.form.get('category_code')!
      .valueChanges
      .subscribe(() => {
        this.form.get('warrant_start')?.removeValidators(Validators.required)
        this.form.get('warrant_start')?.updateValueAndValidity()
        this.form.get('customer')?.removeValidators(Validators.required)
        this.form.get('customer')?.updateValueAndValidity()
        this.form.get('warehouse')?.removeValidators(Validators.required)
        this.form.get('warehouse')?.updateValueAndValidity()
        this.form.get('out_of_order')?.removeValidators(Validators.required)
        this.form.get('out_of_order')?.updateValueAndValidity()

        if (this.warrantyUpdateSelected) {
          this.form.get('warrant_start')?.setValidators(Validators.required)
          this.form.get('warrant_start')?.updateValueAndValidity();
        }
        if (this.customer2CustomerUpdateSelected) {
          this.form.get('customer')?.setValidators(Validators.required)
          this.form.get('customer')?.updateValueAndValidity();
        }

        if (this.customer2WarehouseUpdateSelected) {
          this.form.get('warehouse')?.setValidators(Validators.required)
          this.form.get('warehouse')?.updateValueAndValidity();

          this.form.get('out_of_order')?.setValidators(Validators.required)
          this.form.get('out_of_order')?.updateValueAndValidity();
        }
      })

  }

  private syncFormWarrantDates() {
    this.subSink = this.form.get('warrant_start')!.valueChanges
      .subscribe((value) => {
        if (value) {
          try {
            if (value) {
              this.minAllowedWarrantEndDate = serializeDate(value);
            }
            this.form.get('warrant_end')?.patchValue(null);
          } catch (e) {}
        }

      })
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {return}

    let payload: any = {
      description: this.form.value.description,
      category_code: this.form.value.category_code
    };
    if (this.warrantyUpdateSelected) {
      payload.warrant_start = this.form.value.warrant_start;
      payload.warrant_end = this.form.value.warrant_end;
    } else if (this.customer2WarehouseUpdateSelected) {
      payload.out_of_order = this.form.value.out_of_order;
      payload.warehouse_id = this.form.value.warehouse?.id;
    } else if (this.customer2CustomerUpdateSelected) {
      payload.customer_id = this.form.value.customer?.id;
    }

    this.subSink = this.productItemService
      .createActivity(this._route.snapshot.params[ 'id' ], payload)
      .subscribe({
        next: (res) => {
          this._activities.unshift(res);
          this.form.patchValue({
            current_location: res?.location?.name,
            warrant_start: res.warrant?.warrant_start,
            warrant_end: res?.warrant?.warrant_end
          })
          this.showLocationFormPopup = false;
        }
      })
  }

  ngOnDestroy(): void {
    this._subscriptions.map((sub) => sub.unsubscribe());
  }

}
