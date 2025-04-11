import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { TeamPageComponent } from '../team-page/team-page.component';
import { LoginButtonComponent } from '../shared/components/buttons/login-button/login-button.component';
import { LogoutButtonComponent } from '../shared/components/buttons/logout-button/logout-button.component';

import { AppRoutingRoutingModule } from './app-routing-routing.module';
import { AuthGuard } from '@auth0/auth0-angular';

export const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'app-home', component: HomeComponent},
  { path: 'teams', component: TeamPageComponent, canActivate: [AuthGuard]},
  { path: 'app-about', component: AboutComponent},
  { path: 'app-contact', component: ContactComponent},
  { path: 'login', component: LoginButtonComponent},
  { path: 'logout', component: LogoutButtonComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppRoutingRoutingModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }


