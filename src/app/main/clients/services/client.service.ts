import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientsModule } from '../clients.module';
import { HttpService } from '../../../core/services/http.service';
import { ClientModel } from '../../../models/client.model';

@Injectable({
  providedIn: ClientsModule
})
export class ClientService {

  private clients$ = new BehaviorSubject<ClientModel[]>([]);

  constructor(private http: HttpService) {
    this.clients$.next([
      {
        id: 'Em34PuZA0jbs04',
        parent_id: null,
        name: 'Cooperative Bank',
        branch: 'HQ-Co-operative House',
        location: 'Haile Selassie Avenue, Nairobi',
        region: 'Nairobi',
        contracts_total: 3,
        created_by_id: '',
        created_at: new Date().toLocaleDateString()
      },
      {
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
      {
        id: 'OZvFAdU1nkYWl6Vb',
        parent_id: 'Em34PuZA0jbs04',
        name: 'Cooperative Bank',
        branch: 'Athi river',
        location: '',
        region: 'Nairobi',
        contracts_total: 3,
        created_by_id: '',
        created_at: new Date().toLocaleDateString()
      },
      {
        id: 'FNP40i8fecjaZON3',
        parent_id: null,
        name: 'National Bank',
        branch: 'Head Office',
        location: 'National Bank Building, Harambee Avenue',
        region: 'Nairobi',
        contracts_total: 0,
        created_by_id: '',
        created_at: new Date().toLocaleDateString()
      },
      {
        id: 'ZGqPFhVBNmv0dqAv',
        parent_id: 'FNP40i8fecjaZON3',
        name: 'National Bank',
        branch: 'Kitengela',
        location: '',
        region: 'Nairobi',
        contracts_total: 0,
        created_by_id: '',
        created_at: new Date().toLocaleDateString()
      },
      {
        id: 'hMu91M6IeGHTJGQi',
        parent_id: 'FNP40i8fecjaZON3',
        name: 'National Bank',
        branch: 'Karatina',
        location: '',
        region: 'Thika',
        contracts_total: 0,
        created_by_id: '',
        created_at: new Date().toLocaleDateString()
      },
      {
        id: '54CAQUC07cRAWwI1',
        parent_id: 'FNP40i8fecjaZON3',
        name: 'National Bank',
        branch: 'Nyeri',
        location: '',
        region: 'Central East',
        contracts_total: 0,
        created_by_id: '',
        created_at: new Date().toLocaleDateString()
      },
    ]);
  }

  get clients(): Observable<ClientModel[]> {
    return this.clients$;
  }
}
