import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router"; 

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
emailInput = '';
  isSubscribing = false;
  currentYear = new Date().getFullYear();

socialLinks = [
  { icon: 'fa-brands fa-facebook-f', href: '#facebook', label: 'Facebook', color: 'text-blue-600' },
  { icon: 'fa-brands fa-twitter', href: '#twitter', label: 'Twitter', color: 'text-sky-400' },
  { icon: 'fa-brands fa-linkedin-in', href: '#linkedin', label: 'LinkedIn', color: 'text-blue-700' },
  { icon: 'fa-brands fa-instagram', href: '#instagram', label: 'Instagram', color: 'text-pink-500' }
];


  quickLinks = [
    { label: 'Home', href: '/home' },
    { label: 'About ', href: '/about' },
    { label: 'Cart', href: '/cart' },
    { label: 'Order', href: '/order' },
  ];

 services = [
  { label: 'Electronics', href: '#electronics' },
  { label: 'Fashion & Clothing', href: '#fashion' },
  { label: 'Home & Furniture', href: '#home' },
  { label: 'Beauty & Personal Care', href: '#beauty' },
  { label: 'Sports & Fitness', href: '#sports' },
  { label: 'Groceries', href: '#groceries' }
];


  bottomLinks = [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Service', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' }
  ];

  subscribe() {
    if (!this.emailInput.trim()) return;
    
    this.isSubscribing = true;
    
   
    setTimeout(() => {
      this.isSubscribing = false;
      this.emailInput = '';
   
      console.log('Subscribed successfully!');
    }, 2000);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

 
  trackBySocial(index: number, item: any) {
    return item.label;
  }

  trackByLink(index: number, item: any) {
    return item.label;
  }

  trackByService(index: number, item: any) {
    return item.label;
  }

  trackByBottomLink(index: number, item: any) {
    return item.label;
  }
}
