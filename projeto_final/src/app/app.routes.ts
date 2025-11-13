import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { LocalidadesComponent } from './pages/localidades/localidades.component';


export const routes: Routes = [
    {path:"index",component:IndexComponent},
    {path:"localidades",component:LocalidadesComponent},
    {path:"",redirectTo:"index",pathMatch:"full"},
];
