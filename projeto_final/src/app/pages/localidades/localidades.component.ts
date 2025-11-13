import { Component } from '@angular/core';
import { HeaderComponent } from "../../componentes/header/header.component";
import { FooterComponent } from "../../componentes/footer/footer.component";

@Component({
  selector: 'app-localidades',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './localidades.component.html',
  styleUrl: './localidades.component.css'
})
export class LocalidadesComponent {

}
