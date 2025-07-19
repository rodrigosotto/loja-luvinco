import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardContent, MatCard } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardContent,
    MatCard,
    MatIconModule,
  ],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  isLoading = true;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.logout();
  }

  logout() {
    setTimeout(() => {
      this.authService.logout();
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 1500);
  }
}
