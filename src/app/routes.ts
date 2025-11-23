import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DetailsComponent } from './details/details.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';

const routeConfig: Routes = [
    {
        path: 'homes',
        component: HomeComponent,
        title: 'Home Page',
        canActivate: [authGuard]
    },
    {
        path: 'details/:id',
        component: DetailsComponent,
        title: 'Details Page ',
        canActivate: [authGuard]
    },
    {
        path: '',
        component: LoginComponent,
        title: 'Login Page'
    }
]

export default routeConfig;