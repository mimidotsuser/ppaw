import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from './services/http.service';
import { MetaService } from './services/meta.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [HttpService, MetaService] //singleton services that shouldn't be recreated
    }
  }
}
