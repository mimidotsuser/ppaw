import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHeaderComponent } from './components/content-header/content-header.component';

@NgModule({
  declarations: [
    ContentHeaderComponent
  ],
  imports: [
    CommonModule],
  exports:[
    ContentHeaderComponent
  ]
})
export class SharedModule {}
