import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  user: string = '';
  isMenuOpen: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(private auth: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscription.add(
      this.auth.isLoggedIn$.subscribe(isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        this.cdr.detectChanges();
      })
    );
    this.subscription.add(
      this.auth.user$.subscribe(user => {
        this.user = user;
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.auth.logout();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
