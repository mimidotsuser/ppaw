import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpService } from './services/http.service';
import { MetaService } from './services/meta.service';
import { StorageService } from './services/storage.service';
import { HttpClientModule } from '@angular/common/http';

abstract class EnsureImportedOnce<T> {
  constructor(targetModule: any) {
    if (targetModule) {
      throw new Error(`You are trying to import ${targetModule.constructor.name} again`)
    }
  }
}

@NgModule({
  declarations: [],
  imports: [HttpClientModule],
})
export class CoreModule extends EnsureImportedOnce<CoreModule> {
  constructor(@SkipSelf() @Optional() parent: CoreModule) {
    super(parent);
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [HttpService, MetaService, StorageService] //singleton services that shouldn't be recreated
    }
  }
}
