import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputModule } from '../search-input/search-input.module';
import { ClientSearchInputComponent } from './client-search-input.component';


@NgModule({
  declarations: [
    ClientSearchInputComponent,
  ],
  imports: [
    CommonModule,
    SearchInputModule,
  ],
  exports: [
    ClientSearchInputComponent
  ]
})
export class ClientSearchModule {}
