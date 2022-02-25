import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { MachineModel } from '../../../models/machine.model';
import { SpareModel } from '../../../models/spare.model';

@Injectable({
  providedIn: SharedModule
})
export class ProductService {
  private machines$ = new BehaviorSubject<MachineModel[]>([])
  private spares$ = new BehaviorSubject<SpareModel[]>([])

  constructor() {
    const m = [
      {
        id: Math.random().toString(32).substr(3),
        item_code: 'MDTEQNC71O-083',
        mpn: 'NC7100',
        description: 'NC7100',
        eoq: 35,
        minl: 20,
        rol: 50,
        maxl: 70,
        created_by_id: 'edfforerf'
      },
      {
        id: Math.random().toString(32).substr(3),
        item_code: 'MDTEQNC650-082',
        mpn: 'NC-6500',
        description: 'NC-6500',
        eoq: 20,
        minl: 10,
        rol: 30,
        maxl: 40,
        created_by_id: 'edfforerf'
      },
      {
        id: Math.random().toString(32).substr(3),
        item_code: 'MDTEQNC95-087',
        mpn: 'NC-9500',
        description: 'NC-9500',
        eoq: 35,
        minl: 30,
        rol: 50,
        maxl: 70,
        created_by_id: 'edfforerf'
      },
    ]
    this.machines$.next(m)

    this.spares$.next([
      {
        id: Math.random().toString(32).substr(3),
        item_code: 'MDTSPNC710-001',
        mpn: 'EANC7101IO0122',
        parent_id: m[ 0 ].id,
        description: 'PCBA,IO',
        eoq: 35,
        minl: 20,
        rol: 50,
        maxl: 70,
        created_by_id: 'edfforerf'
      },
      {
        id: Math.random().toString(32).substr(3),
        parent_id: m[ 1 ].id,
        item_code: 'MDTSPNC3A2-002',
        mpn: '3A2BPSC1G-B070',
        description: 'IMAGE SENSOR MC06H-Z07',
        eoq: 20,
        minl: 10,
        rol: 30,
        maxl: 40,
        created_by_id: 'edfforerf'
      }, {
        id: Math.random().toString(32).substr(3),
        parent_id: m[ 2 ].id,
        item_code: 'MDTSPNCZ00-029',
        mpn: 'C-Z00003',
        description: 'PRINTER INTERFACE CABLES (FOR TP30A)',
        eoq: 35,
        minl: 30,
        rol: 50,
        maxl: 70,
        created_by_id: 'edfforerf'
      },
    ])
  }

  get machines(): BehaviorSubject<MachineModel[]> {
    return this.machines$;
  }

  get spares(): BehaviorSubject<SpareModel[]> {
    return this.spares$;
  }
}
