import { Component } from '@angular/core';
import { ImageModel, Roles, User } from '../../interfaces/User';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApicallService } from '../../services/apicall.service';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-user-configuration',
  templateUrl: './user-configuration.component.html',
  styleUrl: './user-configuration.component.scss',
})
export class UserConfigurationComponent {
  navBarActive = false;
  loggedInUser: User | null = null;
  email = '';
  emailCheck = '';
  username = '';
  usernameCheck = '';
  password = '';
  passwordCheck = '';
  base64String = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApicallService
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.authService.getLoggedInUser();
    if (this.loggedInUser) {
      this.loadUserImage();
      console.log('Usuario logueado:', this.loggedInUser);
    } else {
      console.log('No hay usuario logueado');
      this.router.navigate(['/']);
    }
  }

  loadUserImage() {
    if (this.loggedInUser && this.loggedInUser.userId) {
      this.apiService.getImageByuserId(this.loggedInUser.userId).subscribe(
        (data: ImageModel) => {
          if (this.loggedInUser) {
            this.loggedInUser.profileImg = data;
          }
        },
        (error) => {
          console.error('Error al cargar la imagen del usuario:', error);
        }
      );
    }
  }

  updateUsername() {
    if (this.loggedInUser) {
      const updateUser: User = {
        userId: this.loggedInUser?.userId,
        username: this.username,
        email: this.loggedInUser?.email,
        password: this.loggedInUser?.password,
        bornDate: this.loggedInUser?.bornDate,
        rol: this.loggedInUser?.rol,
        profileImg: this.loggedInUser?.profileImg,
        comments: this.loggedInUser?.comments,
        bookings: this.loggedInUser?.bookings,
      };

      if (this.username == this.usernameCheck) {
        this.apiService.patchUser(updateUser).subscribe(
          (response) => {
            console.log('Usuario actualizado exitosamente:', response);
            this.authService.loginUser(updateUser);
            window.location.reload();
          },
          (error) => {
            console.error('Error al aztualizar usuario:', error);
          }
        );
      }
    }
  }

  updatePassword() {
    if (this.loggedInUser) {
      const updateUser: User = {
        userId: this.loggedInUser?.userId,
        username: this.loggedInUser?.username,
        email: this.loggedInUser?.email,
        password: this.password,
        bornDate: this.loggedInUser?.bornDate,
        rol: this.loggedInUser?.rol,
        profileImg: this.loggedInUser?.profileImg,
        comments: this.loggedInUser?.comments,
        bookings: this.loggedInUser?.bookings,
      };

      if (this.password == this.passwordCheck) {
        this.apiService.patchUser(updateUser).subscribe(
          (response) => {
            console.log('Usuario actualizado exitosamente:', response);
            this.authService.loginUser(updateUser);
            window.location.reload();
          },
          (error) => {
            console.error('Error al aztualizar usuario:', error);
          }
        );
      }
    }
  }

  updateEmail() {
    if (this.loggedInUser) {
      const updateUser: User = {
        userId: this.loggedInUser?.userId,
        username: this.loggedInUser.username,
        email: this.email,
        password: this.loggedInUser?.password,
        bornDate: this.loggedInUser?.bornDate,
        rol: this.loggedInUser?.rol,
        profileImg: this.loggedInUser?.profileImg,
        comments: this.loggedInUser?.comments,
        bookings: this.loggedInUser?.bookings,
      };

      if (this.email == this.emailCheck) {
        this.apiService.patchUser(updateUser).subscribe(
          (response) => {
            console.log('Usuario actualizado exitosamente:', response);
            this.authService.loginUser(updateUser);
            window.location.reload();
          },
          (error) => {
            console.error('Error al aztualizar usuario:', error);
          }
        );
      }
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.updateImg(file);
    }
  }

  updateImg(imageFile: File) {
    if (this.loggedInUser) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        if (reader.result && this.loggedInUser?.profileImg?.id) {
          this.base64String = reader.result as string;

          const userImage: ImageModel = {
            id: this.loggedInUser.profileImg?.id,
            name: '',
            type: '',
            fotoBase64: '',
            user: {
              userId: this.loggedInUser?.userId,
              username: this.loggedInUser.username,
              email: this.loggedInUser.username,
              password: this.loggedInUser?.password,
              bornDate: this.loggedInUser?.bornDate,
              rol: this.loggedInUser?.rol,
              comments: this.loggedInUser?.comments,
              bookings: this.loggedInUser?.bookings,
            },
          };

          userImage.fotoBase64 = this.base64String;
          console.log(this.base64String);

          const updateUser: User = {
            userId: this.loggedInUser?.userId,
            username: this.loggedInUser.username,
            email: this.loggedInUser.username,
            password: this.loggedInUser?.password,
            bornDate: this.loggedInUser?.bornDate,
            rol: this.loggedInUser?.rol,
            profileImg: userImage,
            comments: this.loggedInUser?.comments,
            bookings: this.loggedInUser?.bookings,
          };

          console.log(updateUser);

          this.apiService.patchUser(updateUser).subscribe(
            (response) => {
              console.log('Usuario actualizado exitosamente:', response);
              this.apiService.patchImage(userImage).subscribe(
                (response) => {
                  console.log('Imagen actualizado exitosamente:', response);
                  window.location.reload();
                },
                (error) => {
                  console.error('Error al actualizar imagen:', error);
                }
              );
            },
            (error) => {
              console.error('Error al actualizar usuario:', error);
            }
          );
        }
      };
    }
  }
  openSidebar() {
    this.navBarActive = true;
  }

  closeSidebar() {
    this.navBarActive = false;
  }

  navToBooks() {
    this.router.navigate(['/books']);
  }

  userLogOut() {
    this.authService.logoutUser();
    this.navBarActive = false;
    window.location.reload();
  }

  navToHome() {
    this.router.navigate(['/']);
  }
}
