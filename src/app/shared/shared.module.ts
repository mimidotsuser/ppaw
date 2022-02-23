import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidePopupComponent } from './components/side-popup/side-popup.component';

@NgModule({
  declarations: [
    ContentHeaderComponent,
    SidePopupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ContentHeaderComponent,
    FormsModule,
    ReactiveFormsModule,
    SidePopupComponent
  ],
})
export class SharedModule {}
