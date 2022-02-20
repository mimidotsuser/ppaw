import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpService } from './services/http.service';
import { MetaService } from './services/meta.service';


@NgModule({
  declarations: [],
  imports: [],
})
export class CoreModule extends EnsureImportedOnce<CoreModule> {
  constructor(@SkipSelf() @Optional() parent: CoreModule) {
    super(parent);
  }

  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [HttpService, MetaService] //singleton services that shouldn't be recreated
    }
  }
}

abstract class EnsureImportedOnce<T> {
  constructor(targetModule: T) {
    if (targetModule) {
      throw new Error(`You are trying to import ${targetModule.constructor.name} again`)
    }
  }
}
