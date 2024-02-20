import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../shared/models/User';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  user!: User;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    authService.userObservable.subscribe((newUser) => {
      this.user = newUser;
      // console.log(this.user);
    });
  }

  logout() {
    this.authService.Logout();
  }

}
