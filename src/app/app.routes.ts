import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { Landing } from './features/landing/landing';

export const appRoutes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
];
