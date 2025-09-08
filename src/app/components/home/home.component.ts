import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../Services/data.service';
import { Router } from '@angular/router';

interface Product {
  _id: string;
  name: string;
  price: number;
  url: string;
  category: string;
  description:string;
  stock:number
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private _dataServices :DataService , private router: Router){}
  
  activeCategory = 'all';
  sortBy = 'featured';
  

  categories: Category[] = [
    { id: 'all', name: 'All Products', icon: 'fas fa-th-large', count: 1234 },
    { id: 'electronics', name: 'Electronics', icon: 'fas fa-laptop', count: 287 },
    { id: 'fashion', name: 'Fashion', icon: 'fas fa-tshirt', count: 453 },
    { id: 'home', name: 'Home & Garden', icon: 'fas fa-home', count: 186 },
    { id: 'sports', name: 'Sports', icon: 'fas fa-futbol', count: 124 },
    { id: 'books', name: 'Books', icon: 'fas fa-book', count: 184 }
  ];

  products: Product[] = [];

  getProducts(){
    this._dataServices.getData().subscribe({
      next:(data)=>{
    this.products=data.products
    console.log(data)
      }
    })
  }

   addToCart(_id: any) {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
  this._dataServices.addToCart(_id).subscribe({
    next: (res) => {
      console.log("Added to cart", res);
    },
    error: (err) => {
      console.error("Error adding to cart", err);
    }
  });
}


  ngOnInit() {
   this.getProducts()
  }

    scrollTo(section: string) {
    this.router.navigate([], { fragment: section });
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  }

  

  trackByCategory(index: number, category: Category): string {
    return category.id;
  }

  trackByProduct(index: number, product: Product): string {
    return product._id;
  }

  trackByStar(index: number, star: number): number {
    return star;
  }

  setActiveCategory(categoryId: string): void {
    this.activeCategory = categoryId;
  }

  getCategoryButtonClass(categoryId: string): string {
    const baseClass = 'px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    
    if (this.activeCategory === categoryId) {
      return `${baseClass} bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg`;
    }
    
    return `${baseClass} bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md`;
  }



  getFilteredProducts(): Product[] {
    let filtered = this.products;

    // Filter by category
    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.activeCategory);
    }

    // Sort products
    switch (this.sortBy) {
      case 'price-low':
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered = [...filtered].reverse();
        break;
      default:
        // Keep original order for 'featured'
        break;
    }

    return filtered;
  }


}
