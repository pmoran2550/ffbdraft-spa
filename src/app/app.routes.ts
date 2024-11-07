import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'app-home', component: HomeComponent},
    { path: 'app-about', component: AboutComponent},
    { path: 'app-contact', component: ContactComponent}
];
