import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  // Método para iniciar sesión
  loginUser(user: User) {
    // Almacena el usuario en localStorage
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  // Método para cerrar sesión
  logoutUser() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(['/']); // Redirige a la página de inicio de sesión
  }

  // Método para obtener el usuario logueado
  getLoggedInUser(): User | null {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }

  // Método para verificar si hay un usuario logueado
  isLoggedIn(): boolean {
    return this.getLoggedInUser() !== null;
  }
}
