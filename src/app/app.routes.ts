import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { TeamPageComponent } from './team-page/team-page.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'app-home', component: HomeComponent},
    { path: 'teams', component: TeamPageComponent},
    { path: 'app-about', component: AboutComponent},
    { path: 'app-contact', component: ContactComponent}
];
