import { Component } from '@angular/core';
import { HeaderComponent } from "../../componentes/header/header.component";
import { FooterComponent } from "../../componentes/footer/footer.component";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Campos de formulário
  username: string = '';
  password: string = '';

  // Mensagem para feedback
  message: string = '';

  constructor() {}

  login() {
    // Validação simples
    if (!this.username || !this.password) {
      this.message = 'Preencha todos os campos.';
      return;
    }

    
    if (this.username === 'filipe@gmail.com' && this.password === '1234') {
      this.message = 'Login realizado com sucesso!';
      // Aqui você pode redirecionar usando Router:
      // this.router.navigate(['/home']);
    } else {
      this.message = 'Usuário ou senha incorretos.';
    }
  }

}
