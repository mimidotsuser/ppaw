import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpService } from './services/http.service';
import { MetaService } from './services/meta.service';
import { StorageService } from './services/storage.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UnauthenticatedInterceptor } from './interceptors/unauthenticated-interceptor.service';
import { ToastService } from './services/toast.service';

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
    //register services that shouldn't be recreated by lazy loaded modules. Interceptors first.
    return {
      ngModule: CoreModule,
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: UnauthenticatedInterceptor,
        multi: true
      },
        HttpService, MetaService, StorageService, ToastService]
    }
  }
}
