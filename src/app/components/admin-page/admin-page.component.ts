import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../Services/data.service';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  age: number;
  role: 'user' | 'admin';
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  _id: string;           
  name: string;          
  description: string;   
  price: number;         
  category: 'fashion' | 'electronics' | 'home' | 'sports' | 'books' | 'other';      
  url: string;   
  stock: number;  
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  product: Product;   
  quantity: number;
}

interface Order {
  _id: string;
  user: User;   
   products: OrderItem[]; 
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}


@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent implements OnInit {
  
  activeSection: 'users' | 'products' | 'orders' = 'users';
  
  
  users: User[] = [];
  selectedUser: User | null = null;
  isEditUserMode = false;
  isAddUserMode = false;
  userSearchTerm = '';
  userForm: Partial<User> = {
    name: '',
    email: '',
    age: 0,
    role: 'user',
    isConfirmed: false
  };

  
  products: Product[] = [];
  selectedProduct: Product | null = null;
  isEditProductMode = false;
  isAddProductMode = false;
  productSearchTerm = '';
  productForm: Partial<Product> = {
    _id: '',
    name: '',
    description: '',
    price: 0,
    category: 'other',
    url: '',
    stock: 0,
   
  };

  
  orders: Order[] = [];
  selectedOrder: Order | null = null;
  isEditOrderMode = false;
  orderSearchTerm = '';
  orderForm: Partial<Order> = {
    status: 'pending'
  };

  
  loading = false;

  constructor(private _dataServices: DataService) {}

  ngOnInit(): void {
    this.getUsers();
    this.getProducts();
    this.getOrders();
  }

  
  switchSection(section: 'users' | 'products' | 'orders'): void {
    this.activeSection = section;
    this.cancelAllModals();
  }

  cancelAllModals(): void {
    this.cancelEditUser();
    this.cancelAddUser();
    this.cancelEditProduct();
    this.cancelAddProduct();
    this.cancelEditOrder();
  }

  
  getUsers(): void {
    this.loading = true;
    this._dataServices.getUsers().subscribe({
      next: (res) => {
        this.users = res.users || res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
      }
    });
  }

  deleteUser(userId: string): void {
    if (confirm('are you sure to delete this user?')) {
      this.loading = true;
      this._dataServices.deleteUser(userId).subscribe({
        next: (res) => {
          this.getUsers();
          this.loading = false;
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Error in deleting user');
          this.loading = false;
        }
      });
    }
  }

  updateUser(userId: string, userData: Partial<User>): void {
    this.loading = true;
    this._dataServices.updateUser(userId, userData).subscribe({
      next: (res) => {
        this.getUsers();
        this.cancelEditUser();
        this.loading = false;
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Error in updating user');
        this.loading = false;
      }
    });
  }

  startEditUser(user: User): void {
    this.selectedUser = { ...user };
    this.userForm = { ...user };
    this.isEditUserMode = true;
    this.isAddUserMode = false;
  }

  startAddUser(): void {
    this.userForm = {
      name: '',
      email: '',
      password: '',
      age: 0,
      role: 'user',
      isConfirmed: false
    };
    this.isAddUserMode = true;
    this.isEditUserMode = false;
    this.selectedUser = null;
  }

  saveAddUser(): void {
    if (this.userForm) {
      this._dataServices.addUser(this.userForm).subscribe({
        next: (res) => {
          this.getUsers();
          this.cancelAddUser();
        },
        error: (err) => {
          console.error('Add failed:', err);
          console.log(this.userForm);
          alert('Error in adding user');
        }
      });
    }
  }

  saveEditUser(): void {
    if (this.selectedUser && this.userForm) {
      this.updateUser(this.selectedUser._id, this.userForm);
    }
  }

  cancelEditUser(): void {
    this.isEditUserMode = false;
    this.selectedUser = null;
    this.userForm = {
      name: '',
      email: '',
      age: 0,
      role: 'user',
      isConfirmed: false
    };
  }

  cancelAddUser(): void {
    this.isAddUserMode = false;
    this.userForm = {
      name: '',
      email: '',
      age: 0,
      role: 'user',
      isConfirmed: false
    };
  }

  toggleConfirmation(user: User): void {
    this.updateUser(user._id, { isConfirmed: !user.isConfirmed });
  }

  get filteredUsers(): User[] {
    if (!this.userSearchTerm) {
      return this.users;
    }
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.userSearchTerm.toLowerCase())
    );
  }

  
  getProducts(): void {
    this.loading = true;
    this._dataServices.getProducts().subscribe({
      next: (res) => {
        this.products = res.products || res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });
  }

  deleteProduct(productId: string): void {
    if (confirm('are you sure to delete this product?')) {
      this.loading = true;
      this._dataServices.deleteProduct(productId).subscribe({
        next: (res) => {
          this.getProducts();
          this.loading = false;
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Error in deleting product');
          this.loading = false;
        }
      });
    }
  }

  updateProduct(productId: string, productData: Partial<Product>): void {
    this.loading = true;
    this._dataServices.updateProduct(productId, productData).subscribe({
      next: (res) => {
        this.getProducts();
        this.cancelEditProduct();
        this.loading = false;
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Error in updating product');
        this.loading = false;
      }
    });
  }

  addProduct(productData: Partial<Product>): void {
    this.loading = true;
    this._dataServices.addProduct(productData).subscribe({
      next: (res) => {
        this.getProducts();
        this.cancelAddProduct();
        this.loading = false;
      },
      error: (err) => {
        console.error('Add failed:', err);
        alert('Error in adding product');
        this.loading = false;
      }
    });
  }

  startEditProduct(product: Product): void {
    this.selectedProduct = { ...product };
    this.productForm = { ...product };
    this.isEditProductMode = true;
    this.isAddProductMode = false;
  }

  startAddProduct(): void {
    this.productForm = {
      _id: '',
      name: '',
      description: '',
      price: 0,
      category: 'other',
      url: '',
      stock: 0,
     
    };
    this.isAddProductMode = true;
    this.isEditProductMode = false;
    this.selectedProduct = null;
  }

  saveEditProduct(): void {
    if (this.selectedProduct && this.productForm) {
      this.updateProduct(this.selectedProduct._id, this.productForm);
    }
  }

  saveAddProduct(): void {
    if (this.productForm) {
      this.addProduct(this.productForm);
    }
  }

  
  addUser(userData: Partial<User>): void {
    this.loading = true;
    this._dataServices.createUser(userData).subscribe({
      next: (res) => {
        this.getUsers();
        this.cancelAddUser();
        this.loading = false;
      },
      error: (err) => {
        console.error('Add user failed:', err);
        alert('Error in adding user');
        this.loading = false;
      }
    });
  }

 

  cancelEditProduct(): void {
    this.isEditProductMode = false;
    this.selectedProduct = null;
    this.productForm = {
      _id: '',
      name: '',
      description: '',
      price: 0,
      category: 'other',
      url: '',
      stock: 0
    };
  }

  cancelAddProduct(): void {
    this.isAddProductMode = false;
    this.productForm = {
      _id: '',
      name: '',
      description: '',
      price: 0,
      category: 'other',
      url: '',
      stock: 0
    };
  }

 

  get filteredProducts(): Product[] {
    if (!this.productSearchTerm) {
      return this.products;
    }
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.productSearchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(this.productSearchTerm.toLowerCase())
    );
  }

  
  getOrders(): void {
    this.loading = true;
    this._dataServices.getOrders().subscribe({
      next: (res) => {
        this.orders = res.orders || res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.loading = false;
      }
    });
  }

  deleteOrder(orderId: string): void {
    if (confirm('are you sure to delete this order?')) {
      this.loading = true;
      this._dataServices.deleteOrder(orderId).subscribe({
        next: (res) => {
          this.getOrders();
          this.loading = false;
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Error in deleting order');
          this.loading = false;
        }
      });
    }
  }
  
updateOrder(orderId: string, orderData: Partial<Order>): void {
  this.loading = true;

  
  const { createdAt, updatedAt, ...cleanData } = orderData;

  this._dataServices.updateOrder(orderId, cleanData).subscribe({
    next: (res) => {
      this.getOrders();
      this.cancelEditOrder();
      this.loading = false;
    },
    error: (err) => {
      console.error('Update failed:', err);
      alert('Error in updating order');
      this.loading = false;
    }
  });
}


  startEditOrder(order: Order): void {
    this.selectedOrder = { ...order };
    this.orderForm = { status: order.status };
    this.isEditOrderMode = true;
  }

  saveEditOrder(): void {
    if (this.selectedOrder && this.orderForm) {
      this.updateOrder(this.selectedOrder._id, this.orderForm);
    }
  }

  cancelEditOrder(): void {
    this.isEditOrderMode = false;
    this.selectedOrder = null;
    this.orderForm = { status: 'pending' };
  }

  get filteredOrders(): Order[] {
    if (!this.orderSearchTerm) {
      return this.orders;
    }
    return this.orders.filter(order =>
      order.user.name.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(this.orderSearchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(this.orderSearchTerm.toLowerCase())
    );
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  
  getConfirmedUsersCount(): number {
    return this.users.filter(user => user.isConfirmed).length;
  }



  getPendingOrdersCount(): number {
    return this.orders.filter(order => order.status === 'pending').length;
  }

  getTotalRevenue(): number {
    return this.orders
      .filter(order => order.status === 'delivered')
      .reduce((total, order) => total + order.totalAmount, 0);
  }

  
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('ar-EG');
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)}  EGP`;
  }

  trackByUser(index: number, user: User): string {
    return user._id;
  }

  
}