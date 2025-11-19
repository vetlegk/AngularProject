import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { LoginComponent } from './login/login.component';

const routeConfig: Routes = [
    {
        path: 'homes',
        component: HomeComponent,
        title: 'Home Page'
    },
    {
        path: 'details/:id',
        component: DetailsComponent,
        title: 'Details Page '
    },
    {
        path: '',
        component: LoginComponent,
        title: 'Login Page'
    }
]

export default routeConfig;