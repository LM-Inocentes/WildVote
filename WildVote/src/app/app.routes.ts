import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  {path : '',title: 'WildVote',  component : DashboardComponent},
  {path : 'login',title: 'WildVote-Login',  component : LoginComponent},
  {path : 'register',title: 'WildVote-Register',  component : RegisterComponent},
];
