import { Injectable } from '@angular/core';
import { CheckoutModule } from '../checkout.module';
import { BehaviorSubject, Observable } from 'rxjs';
import { MRFLog, MRFModel, MRFPurpose, MRFStage } from '../../../models/m-r-f.model';
import { HttpService } from '../../../core/services/http.service';

@Injectable({
  providedIn: CheckoutModule
})
export class CheckoutService {

  private myRequests$ = new BehaviorSubject<MRFModel[]>([]);

  constructor(private http: HttpService) {

    const demoLogs: MRFLog[] = [
      {
        id: 12,
        stage: MRFStage.CREATE,
        remarks: 'Item created',
        created_at: new Date().toLocaleDateString(),
        created_by_id: 'edfforerf',

      }, {
        id: 13,
        stage: MRFStage.VERIFY,
        remarks: 'Verified some items and here is a sample remarks',
        created_at: new Date().toLocaleDateString(),
        created_by_id: 'edfforerf'
      }, {
        id: 14,
        stage: MRFStage.APPROVE,
        remarks: 'Approved items and here is a sample remarks',
        created_at: new Date().toLocaleDateString(),
        created_by_id: 'edfforerf',
        created_by: {
          id: 'ddd',
          first_name: 'John',
          last_name: 'Doe',
          role_id: 'dd3d',
          email: 'emi@email.com',
          status: 1
        }
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
            client_id: '6mKy1FhLWuQVZ0O',
            type: 'spare',
            purpose: MRFPurpose.CLIENT_REPAIR,
            product_id: 'ajwcnw5QTW79PwLM',
            qty_requested: 10,
            qty_verified: 8,
            qty_approved: 5,
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
            client_id: 'hMu91M6IeGHTJGQi',
            type: 'machine',
            purpose: MRFPurpose.CLIENT_PURCHASE,
            product_id: 'VguDlcIHj5zeEYns',
            qty_requested: 10,
            qty_verified: 8,
            qty_approved: 8,
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
            client_id: 'Em34PuZA0jbs04',
            type: 'machine',
            purpose: MRFPurpose.CLIENT_PURCHASE,
            product_id: 'oJoZzozN2GhJTljj',
            qty_requested: 13,
            qty_verified: 13,
            qty_approved: 13,
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
        logs: demoLogs,
        created_by: {
          id: 'ddd',
          first_name: 'James',
          last_name: 'Milan',
          role_id: 'dd3d',
          email: 'emi@email.com',
          status: 1
        }
      },
    ])

  }

  get requestsPendingCheckout(): Observable<MRFModel[]> {
    return this.myRequests$;
  }
}
