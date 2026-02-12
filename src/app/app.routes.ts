import { Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'config', pathMatch: 'full' },
  { path: 'config', component: ConfigComponent },
  { path: 'dashboard', component: DashboardComponent }
];
