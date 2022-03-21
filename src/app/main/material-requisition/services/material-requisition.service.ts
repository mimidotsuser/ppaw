import { Injectable } from '@angular/core';
import { BehaviorSubject, map, mergeMap, Observable, take } from 'rxjs';
import { MaterialRequisitionModule } from '../material-requisition.module';
import { HttpService } from '../../../core/services/http.service';
import {
  MRFLog,
  MRFModel,
  MRFOrderItemModel,
  MRFPurpose,
  MRFStage
} from '../../../models/m-r-f.model';

@Injectable({
  providedIn: MaterialRequisitionModule
})
export class MaterialRequisitionService {

  private myRequests$ = new BehaviorSubject<MRFModel[]>([]);

  constructor(private http: HttpService) {

    const demoLogs: MRFLog[] = [
      {
        id: 12,
        stage: MRFStage.CREATE,
        remarks: 'Item created',
        created_at: new Date().toLocaleDateString(),
        created_by_id: 'edfforerf'
      }, {
        id: 13,
        stage: MRFStage.VERIFY,
        remarks: 'Verified some items and here is a sample remarks',
        created_at: new Date().toLocaleDateString(),
        created_by_id: 'edfforerf'
      }
    ]

    this.myRequests$.next([
      {
        created_at: new Date().toLocaleDateString(),
        id: '2n9mOiLAqttunBVUw',
        created_by_id: 'edfforerf',
        order_id: 1,
        order_items: [
          {
            id: 'jEP3ucSrMYOcjWBk',
            client_id: '6mKy1FhLWuQVZ0O',
            type: 'spare',
            purpose: MRFPurpose.CLIENT_REPAIR,
            product_id: 'ajwcnw5QTW79PwLM',
            qty_requested: 10,
            qty_verified: 8,
            qty_approved: 5,
            qty_issued: 5,
            worksheet_id: 'zFwY9svIcM1mcZA',
            product: {
              id: 'ajwcnw5QTW79PwLM',
              parent_id: 'VguDlcIHj5zeEYns',
              item_code: 'MDTSPNCZ00-029',
              mpn: 'C-Z00003',
              description: 'PRINTER INTERFACE CABLES (FOR TP30A)',
              eoq: 35,
              minl: 30,
              rol: 50,
              maxl: 70,
              created_by_id: 'edfforerf'
            },
            client: {
              id: '6mKy1FhLWuQVZ0O',
              parent_id: 'Em34PuZA0jbs04',
              name: 'Cooperative Bank',
              branch: 'Mlolongo',
              location: '',
              region: 'Nairobi',
              contracts_total: 3,
              created_by_id: '',
              created_at: new Date().toLocaleDateString()
            },
          },
          {
            id: 'SLn6zxJBrjMuTUS',
            client_id: 'hMu91M6IeGHTJGQi',
            type: 'machine',
            purpose: MRFPurpose.CLIENT_PURCHASE,
            product_id: 'VguDlcIHj5zeEYns',
            qty_requested: 1,
            product: {
              id: 'VguDlcIHj5zeEYns',
              item_code: 'MDTEQNC650-082',
              mpn: 'NC-6500',
              description: 'NC-6500',
              eoq: 20,
              minl: 10,
              rol: 30,
              maxl: 40,
              created_by_id: 'edfforerf'
            },
            client: {
              id: 'hMu91M6IeGHTJGQi',
              parent_id: 'FNP40i8fecjaZON3',
              name: 'National Bank',
              branch: 'Karatina',
              location: '',
              region: 'Thika',
              contracts_total: 0,
              created_by_id: '',
              created_at: new Date().toLocaleDateString()
            }
          },
          {
            id: '2ky4GyjHOgCM2Ma',
            client_id: 'Em34PuZA0jbs04',
            type: 'machine',
            purpose: MRFPurpose.CLIENT_PURCHASE,
            product_id: 'oJoZzozN2GhJTljj',
            qty_approved: 0,
            qty_requested: 1,
            product: {
              id: 'oJoZzozN2GhJTljj',
              item_code: 'MDTEQNC95-087',
              mpn: 'NC-9500',
              description: 'NC-9500',
              eoq: 35,
              minl: 30,
              rol: 50,
              maxl: 70,
              created_by_id: 'edfforerf'
            },
            client: {
              id: 'Em34PuZA0jbs04',
              parent_id: null,
              name: 'Family Bank',
              branch: 'Ruaka Branch',
              location: 'Ruaka Square Building',
              region: 'Kiambu',
              contracts_total: 3,
              created_by_id: '',
              created_at: new Date().toLocaleDateString()
            }
          }
        ],
        logs: demoLogs
      },
    ])

  }

  formatOrderId(order: number): string {
    return `REQUEST-${String(order).padStart(4, '0')}`
  }

  aggregateQty(items: MRFOrderItemModel[]): {
    verified: number, approved: number,
    issued: number, requested: number
  } {
    return items.reduce((acc, val) => {
      acc.issued += !val.qty_issued ? -1 : val.qty_issued;
      acc.verified += !val.qty_verified ? -1 : val.qty_verified;
      acc.approved += !val.qty_approved ? -1 : val.qty_approved;
      acc.requested += val.qty_requested || 0;
      return acc;
    }, {verified: 0, approved: 0, issued: 0, requested: 0});
  }

  get myRequests(): Observable<MRFModel[]> {
    return this.myRequests$;
  }

  get requestsToVerify(): Observable<MRFModel[]> {
    return this.myRequests$;
  }

  get requestsToApprove(): Observable<MRFModel[]> {
    return this.myRequests$;
  }

  findById(id: string): Observable<MRFModel> {
    return this.myRequests$
      .pipe(map((v) => v.filter((x) => x.id == id)))
      .pipe(mergeMap((v) => v))
      .pipe(take(1))
  }
}
