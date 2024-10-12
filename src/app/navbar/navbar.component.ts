import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router) {}

  logout() {
    // Clear the user session (e.g. remove token from local storage)
    localStorage.removeItem('token');
    // Navigate to the login page
    this.router.navigate(['/']);
  }

}
