import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  name: string;
  email: string;
  age: number;
  role: 'user' | 'admin';
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;           
  name: string;          
  description: string;   
  price: number;         
  category: string;      
  url: string;   
  stock: number;  
}

export interface OrderItem {
  product: Product;   // populated product object
  quantity: number;
}

export interface Order {
  _id: string;
  user: User;          // populated user object
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}


@Injectable({
  providedIn: 'root' 
})
export class DataService {
 
  constructor(private http: HttpClient) {}

  // Helper method to get headers with token
  private getHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('token');
    return {
      'token': token || ''
    };
  }

  // =============== EXISTING METHODS (الطرق الموجودة) ===============
  
  getData(): Observable<any> {
    return this.http.get("http://localhost:3000/posts");
  }

  addToCart(productId: string, quantity: number = 1): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token'); 
    console.log(token);
    
    return this.http.post(
      'http://localhost:3000/cart',
      {
        user: userId,
        products: [
          { 
            product: productId,
            quantity: quantity 
          }
        ]
      },
      {
        headers: {
          token: token || ''
        }
      }
    );
  }

  getCartByID(): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token'); 
    return this.http.get(`http://localhost:3000/cart/${userId}`, {
      headers: {
        token: token || ''
      }
    });
  }

  deleteItemFromCart(cartId: string, productId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(
      `http://localhost:3000/cart/${cartId}/product/${productId}`,
      {
        headers: {
          token: token || ''
        }
      }
    );
  }

  deleteCart(cartId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(
      `http://localhost:3000/cart/${cartId}`,
      {
        headers: {
          token: token || ''
        }
      }
    );
  }

  addOrder(productId: string, quantity: number = 1, amount: number): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token'); 
    console.log(token);
    
    return this.http.post(
      'http://localhost:3000/order',
      {
        user: userId,
        products: [
          { 
            product: productId, 
            quantity: quantity 
          }
        ],
        totalAmount: amount
      },
      {
        headers: {
          token: token || ''
        }
      }
    );
  }

  getOrderById(): Observable<any> {
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token'); 
    return this.http.get(`http://localhost:3000/order/${userId}`, {
      headers: {
        token: token || ''
      }
    });
  }

  getUsers(): Observable<any> {
    const token = localStorage.getItem('token'); 
    return this.http.get(`http://localhost:3000/admin/user`, {
      headers: {
        token: token || ''
      }
    });
  }

  addUser(userData: Partial<User>): Observable<any> {
    return this.http.post('http://localhost:3000/user/register', userData);
  }

  deleteUser(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(
      `http://localhost:3000/admin/user/${id}`,
      {
        headers: {
          token: token || ''
        }
      }
    );
  }

  updateUser(id: string, data: any): Observable<any> {
    const token = localStorage.getItem('token'); 
    return this.http.put(
      `http://localhost:3000/admin/user/${id}`,
      data,   
      {
        headers: {
          token: token || ''
        }
      }
    );
  }

  cancelOrder(orderId: string): Observable<any> {
    const token = localStorage.getItem('token'); 
    return this.http.delete(
      `http://localhost:3000/order/${orderId}`,
      {
        headers: {
          token: token || ''
        }
      }
    );
  }

  // =============== NEW METHODS FOR ADMIN PANEL (الطرق الجديدة لوحة الإدارة) ===============

  // Create new user (Admin)
  createUser(userData: Partial<User>): Observable<any> {
    return this.http.post(
      'http://localhost:3000/user/register',
      userData,
      {
        headers: this.getHeaders()
      }
    );
  }

  // =============== PRODUCTS METHODS (طرق المنتجات) ===============
  
  // Get all products
  getProducts(): Observable<any> {
    return this.http.get('http://localhost:3000/posts'); // استخدام نفس الـ endpoint الموجود
  }

  // Get product by ID
  getProductById(productId: string): Observable<any> {
    return this.http.get(`http://localhost:3000/getPosts/${productId}`);
  }

  // Add new product (Admin only)
  addProduct(productData: Partial<Product>): Observable<any> {
    return this.http.post(
      'http://localhost:3000/admin/posts',
      productData,
      {
        headers: this.getHeaders()
      }
    );
  }

  // Update product (Admin only)
  updateProduct(productId: string, productData: Partial<Product>): Observable<any> {
    return this.http.put(
      `http://localhost:3000/admin/posts/${productId}`,
      productData,
      {
        headers: this.getHeaders()
      }
    );
  }

  // Delete product (Admin only)
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(
      `http://localhost:3000/admin/posts/${productId}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // =============== ORDERS MANAGEMENT (إدارة الطلبات) ===============
  
  // Get all orders (Admin only)
  getOrders(): Observable<any> {
    return this.http.get(
      'http://localhost:3000/admin/order',
      {
        headers: this.getHeaders()
      }
    );
  }

  // Get order by ID (Admin)
  getOrderByIdAdmin(orderId: string): Observable<any> {
    return this.http.get(
      `http://localhost:3000/order/${orderId}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // Update order (Admin only - mainly for status updates)
  updateOrder(orderId: string, orderData: Partial<Order>): Observable<any> {
    return this.http.put(
      `http://localhost:3000/admin/order/${orderId}`,
      orderData,
      {
        headers: this.getHeaders()
      }
    );
  }

  // Delete order (Admin only)
  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(
      `http://localhost:3000/admin/order/${orderId}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  // Update order status (Admin only)
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    return this.http.patch(
      `http://localhost:3000/admin/order/${orderId}/status`,
      { status },
      {
        headers: this.getHeaders()
      }
    );
  }

  // =============== UTILITY METHODS (طرق مساعدة) ===============
  
  // Check if user is admin
  isAdmin(): boolean {
    const userRole = localStorage.getItem('userRole');
    return userRole === 'admin';
  }

  // Get current user info
  getCurrentUser(): Observable<any> {
    return this.http.get(
      'http://localhost:3000/auth/me',
      {
        headers: this.getHeaders()
      }
    );
  }

  // Get admin statistics
  getAdminStats(): Observable<any> {
    return this.http.get(
      'http://localhost:3000/admin/stats',
      {
        headers: this.getHeaders()
      }
    );
  }

  // Search products
  searchProducts(searchTerm: string): Observable<any> {
    return this.http.get(`http://localhost:3000/posts/search?q=${searchTerm}`);
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<any> {
    return this.http.get(`http://localhost:3000/posts/category/${category}`);
  }

  // Upload image (if needed)
  uploadImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(
      'http://localhost:3000/upload/image',
      formData,
      {
        headers: {
          'token': token || ''
          // Don't set Content-Type for FormData
        }
      }
    );
  }
}