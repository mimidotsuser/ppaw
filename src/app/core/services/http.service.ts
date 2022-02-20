import { Injectable } from '@angular/core';
import { CoreModule } from "../shared.module";

@Injectable({
  providedIn: CoreModule
})
export class HttpService {

  constructor() { }
}
