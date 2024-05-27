import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApicallService } from '../../services/apicall.service';
import { User } from '../../interfaces/User';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  navBarActive = false;

  password = '';
  email = '';

  constructor(
    private router: Router,
    private apiService: ApicallService,
    private authService: AuthService
  ) {}

  openSidebar() {
    this.navBarActive = true;
    console.log(this.password);
    console.log(this.email);
  }

  closeSidebar() {
    this.navBarActive = false;
  }

  navToHome() {
    this.router.navigate(['/']);
  }

  navToRegister() {
    this.router.navigate(['/register']);
  }

  logIn(email: string, password: string) {
    this.apiService.getUsers().subscribe(
      (users: User[]) => {
        const filteredUsers = users.filter(
          (user) => user.email === this.email && user.password === this.password
        );
        if (filteredUsers.length > 0) {
          const loggedInUser = filteredUsers[0];
          console.log('Inicio de sesión exitoso');

          // Guarda el usuario logueado usando el servicio de autenticación
          this.authService.loginUser(loggedInUser);

          // Verifica el rol del usuario y redirige
          if (loggedInUser.rol === 'ADMIN') {
            console.log('Usuario con rol ADMIN');
            this.router.navigate(['/']);
          } else if (loggedInUser.rol === 'USER') {
            console.log('Usuario con rol USER');
            this.router.navigate(['/']);
          } else {
            console.log('Usuario con rol desconocido');
          }
        } else {
          console.log('Credenciales incorrectas');
        }
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }
}
