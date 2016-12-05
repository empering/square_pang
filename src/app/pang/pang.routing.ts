import { RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PangComponent } from './pang.component';

const routes: Route[] = [
  {
    path: '',
    component: PangComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
