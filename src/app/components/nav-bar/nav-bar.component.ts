import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../Services/auth.service'; // استورد السيرفس

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;
  CTA = "Login";

  menuItems = [
    { label: 'Home', href: '/home' },
    { label: 'Cart', href: '/cart' },
    { label: 'Order', href: '/order' },
  
  ];

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe((loggedIn) => {
      this.CTA = loggedIn ? "Logout" : "Login";
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 10;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  handleCTA() {
    if (this.CTA === "Logout") {
      this.auth.logout();
      localStorage.clear();
      this.router.navigate(['/home']);   
    } else {
      this.router.navigate(['/login']);  
    }
  }

  trackByFn(index: number, item: any) {
    return item.label;
  }
}
