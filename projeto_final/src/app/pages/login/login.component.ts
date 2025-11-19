import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Campos de formulário
  username: string = '';
  password: string = '';

  // Mensagem para feedback
  message: string = '';

  constructor(private auth: AuthService, private router: Router) { }

  login() {
    // Validação simples
    if (!this.username || !this.password) {
      this.message = 'Preencha todos os campos.';
      return;
    }


    if (this.auth.login(this.username, this.password)) {
      this.message = 'Login realizado com sucesso!';
      this.router.navigate(['/']); // redirect to home
    } else {
      this.message = 'Usuário ou senha incorretos.';
    }
  }

}
