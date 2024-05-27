import { Component } from '@angular/core';
import { ApicallService } from '../../services/apicall.service';
import { Router } from '@angular/router';
import { Roles, User, ImageModel } from '../../interfaces/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  navBarActive = false;
  username = '';
  password = '';
  email = '';
  base64String = '';
  imageName = '';
  imageType = '';

  constructor(private router: Router, private apiService: ApicallService) {}

  openSidebar() {
    this.navBarActive = true;
  }

  closeSidebar() {
    this.navBarActive = false;
  }

  navToHome() {
    this.router.navigate(['/']);
  }

  navToLogin() {
    this.router.navigate(['/login']);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imageName = file.name;
      this.imageType = file.type;
      this.updateImg(file);
    }
  }

  updateImg(imageFile: File) {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      if (reader.result) {
        this.base64String = reader.result as string;
      }
    };
  }

  registerUser() {
    const userImage: ImageModel = {
      id: 0,
      name: this.imageName,
      type: this.imageType,
      fotoBase64: this.base64String,
    };

    const newUser: User = {
      userId: 0,
      username: this.username,
      email: this.email,
      password: this.password,
      bornDate: new Date(),
      rol: Roles.USER,
      comments: [],
      bookings: [],
    };

    this.apiService.postUser(newUser, userImage).subscribe(
      (response) => {
        console.log('Usuario añadido exitosamente:', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error al añadir usuario:', error);
      }
    );
  }
}
