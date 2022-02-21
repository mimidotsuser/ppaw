import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHeaderComponent } from './components/content-header/content-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchService } from './services/search.service';

@NgModule({
  declarations: [
    ContentHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ContentHeaderComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SearchService]
})
export class SharedModule {}
