import { Component } from '@angular/core';
import { HeaderComponent } from "../../componentes/header/header.component";
import { FooterComponent } from "../../componentes/footer/footer.component";

@Component({
  selector: 'app-publicacoes',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './publicacoes.component.html',
  styleUrl: './publicacoes.component.css'
})
export class PublicacoesComponent {

}
