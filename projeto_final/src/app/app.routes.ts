import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { LocalidadesComponent } from './pages/localidades/localidades.component';
import { PublicacoesComponent } from './pages/publicacoes/publicacoes.component';
import { ContatoComponent } from './pages/contato/contato.component';
import { LoginComponent } from './pages/login/login.component';


export const routes: Routes = [
    {path:"index",component:IndexComponent},
    {path:"localidades",component:LocalidadesComponent},
    {path:"publicacoes",component:PublicacoesComponent},
    {path:"contato",component:ContatoComponent},
    {path:"login",component:LoginComponent},
    {path:"",redirectTo:"index",pathMatch:"full"},
];
