import { NgModule } from '@angular/core';
import { PangComponent } from './pang.component';
import { CommonModule } from '@angular/common';
import { routing } from './pang.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    routing
  ],
  declarations: [
    PangComponent
  ],
  bootstrap: [
    PangComponent
  ]
})
export class PangModule {}
