import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../Services/data.service';
import { Router } from '@angular/router';

interface OrderItem {
  product: {
    _id: string;           
    name: string;          
    description: string;   
    price: number;         
    category: string;      
    url: string;   
    stock: number;  
  };
  quantity: number;
}

interface Order {
  _id: string;
  user: string; 
  products: OrderItem[];
  totalAmount: number;
  status: "pending" | "shipped" | "delivered";
  createdAt: string; 
  updatedAt: string;
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  constructor(private _dataServices: DataService , private router: Router) {}

  orders: Order[] = [];

  getOrders() {
    this._dataServices.getOrderById().subscribe({
      next: (res) => {
        this.orders = res.orders;   
        console.log(res);
      }
    });
  }

  ngOnInit(): void {
    this.getOrders();
  }

  trackByOrderItem(index: number, item: OrderItem): string {
    return item.product._id;
  }

 
  getProgressWidth(status: string): string {
    switch(status) {
      case 'pending':
        return '33.33%';
      case 'shipped':
        return '66.66%';
      case 'delivered':
        return '100%';
      default:
        return '0%';
    }
  }

 
  getTotalSpent(): number {
    return this.orders.reduce((total, order) => total + order.totalAmount, 0);
  }

  
  getOrdersByStatus(status: string): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  
  getStatusColorClass(status: string): string {
    switch(status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  }

  
  trackPackage(orderId: string) {
    console.log('Tracking package for order:', orderId);
    
  }

  reorderItems(order: Order) {
    console.log('Reordering items:', order.products);
    
  }

cancelOrder(orderId: string) {
  console.log('Cancelling order:', orderId);

  if (confirm('Are you sure you want to cancel this order?')) {
    this._dataServices.cancelOrder(orderId).subscribe({
      next: (res) => {
        console.log('Order cancelled:', res);
        this.getOrders(); // هنا هتعمل refresh للطلبات
      },
      error: (err) => {
        console.error('Cancel failed:', err);
        alert('فشل في إلغاء الطلب');
      }
    });
  }
}

continueShopping(): void {
  this.router.navigate(['/home']).then(() => {
    window.scrollTo(0, 0); 
  });
}

}