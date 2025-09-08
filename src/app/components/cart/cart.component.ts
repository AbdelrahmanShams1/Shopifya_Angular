import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../Services/data.service';
import { Router } from '@angular/router';

interface CartItem {
  product: {
    _id: string;           
    name: string;          
    description: string;   
    price: number;         
    category: string;      
    url: string;   
    stock: number;  
  }     
  quantity: number;     
  _id: string
}



@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  constructor(private _dataServices: DataService, private router: Router) {}

  cartID = ''
  cartItems: (CartItem)[] = [];

  
  private readonly TAX_RATE = 0.085;
  
  
  private readonly SHIPPING_COST = 9.99;
  private readonly FREE_SHIPPING_THRESHOLD = 100;

  updateQuantity(item: any, change: number) {
    if (!item?.product?._id) return;
    this.addToCart(item.product._id, change); 
  }

  addToCart(_id: any, quantityChange: number) {
    this._dataServices.addToCart(_id, quantityChange).subscribe({
      next: (res) => {
        this.cartItems = res.cart.products
        console.log("Updated cart", res)
      },
      error: (err) => console.error("Error updating cart", err)
    });
  }

  getCartById() {
    this._dataServices.getCartByID().subscribe((res: any) => {
      console.log(res)
      this.cartID = res.cartData._id
      this.cartItems = res.cartData.products
    });
  }

  deleteItemFromCart(productId: string) {
    console.log(productId, "ff");
    
    this._dataServices.deleteItemFromCart(this.cartID, productId).subscribe(res => {
      console.log('تم المسح:', res);
      this.cartItems = res.cart.products
    });
  }

  deleteCart(){
    this._dataServices.deleteCart(this.cartID).subscribe(res=>{
      console.log('تم المسح:', res);
    })
  }

  ngOnInit() {
    this.getCartById()
    console.log(this.cartItems)
  }

  trackByItem(index: number, item: any): string | number {
    return item?.product?._id ?? index;
  }

continueShopping(): void {
  this.router.navigate(['/home']).then(() => {
    window.scrollTo(0, 0); 
  });
}


  removeItem(itemId: string): void {
    this.cartItems = this.cartItems.filter(item => item.product._id != itemId);
  }

  onItemSelectionChange(): void {
   
  }

  

 
  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => {
      if (item?.product?.price && item?.quantity) {
        return total + (item.product.price * item.quantity);
      }
      return total;
    }, 0);
  }


  getTax(): number {
    return this.getSubtotal() * this.TAX_RATE;
  }

 
  getShipping(): number {
    const subtotal = this.getSubtotal();
    return subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
  }

 
  getTotal(): number {
    return this.getSubtotal() + this.getTax() + this.getShipping();
  }

 
  getTotalItemsCount(): number {
    return this.cartItems.reduce((total, item) => total + (item?.quantity || 0), 0);
  }


  isEligibleForFreeShipping(): boolean {
    return this.getSubtotal() >= this.FREE_SHIPPING_THRESHOLD;
  }

 
  getRemainingForFreeShipping(): number {
    const subtotal = this.getSubtotal();
    return subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.FREE_SHIPPING_THRESHOLD - subtotal;
  }


  getFreeShippingProgress(): number {
    const subtotal = this.getSubtotal();
    return Math.min((subtotal / this.FREE_SHIPPING_THRESHOLD) * 100, 100);
  }

 
  getSavings(): number {
    
    return 0;
  }


  formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

 
  hasItems(): boolean {
    return this.cartItems.length > 0;
  }

 
  getCartSummary() {
    return {
      items: this.cartItems,
      itemsCount: this.getTotalItemsCount(),
      subtotal: this.getSubtotal(),
      tax: this.getTax(),
      shipping: this.getShipping(),
      total: this.getTotal(),
      freeShippingEligible: this.isEligibleForFreeShipping(),
      savings: this.getSavings()
    };
  }

  

  /**
   * Add single order (your existing function)
   */
  addOrder(productId: string, quantity: number = 1, amount: number) {
    this._dataServices.addOrder(productId, quantity, amount).subscribe({
      next: (res) => {
        console.log("Updated order", res)
      }
    })
  }

  /**
   * Process checkout for all items in cart
   * This creates separate orders for each product in the cart
   */
  processCheckout(): void {
    if (!this.hasItems()) {
      console.warn('Cart is empty, cannot process checkout');
      return;
    }

    const totalAmount = this.getTotal();
    let completedOrders = 0;
    const totalOrders = this.cartItems.length;

    console.log('Starting checkout process for', totalOrders, 'items');
    console.log('Total amount:', totalAmount);

    
    this.cartItems.forEach((item, index) => {
      if (item?.product?._id && item?.quantity) {
        
        const itemSubtotal = item.product.price * item.quantity;
        const itemTax = itemSubtotal * this.TAX_RATE;
        const itemShipping = index === 0 ? this.getShipping() : 0; 
        const itemTotal = itemSubtotal + itemTax + itemShipping;

        this.addOrder(item.product._id, item.quantity, itemTotal);
        
        completedOrders++;
        
        
        if (completedOrders === totalOrders) {
          this.clearCartAfterCheckout();
        }
      }
    });
  }

 
  processCheckoutAsSingleOrder(): void {
    if (!this.hasItems()) {
      console.warn('Cart is empty, cannot process checkout');
      return;
    }

    const firstItem = this.cartItems[0];
    const totalQuantity = this.getTotalItemsCount();
    const totalAmount = this.getTotal();

    this.addOrder(firstItem.product._id, totalQuantity, totalAmount);
    this.clearCartAfterCheckout();
  }

  /**
   * Clear cart after successful checkout
   */
  private clearCartAfterCheckout(): void {
   
    this.cartItems = [];
    this.deleteCart()
  
    
    console.log('Cart cleared after successful checkout');
    
    
  }

  /**
   * Show checkout confirmation
   */
  confirmCheckout(): void {
    const summary = this.getCartSummary();
    const confirmMessage = `
      Order Summary:
      Items: ${summary.itemsCount}
      Subtotal: ${summary.subtotal.toFixed(2)}
      Tax: ${summary.tax.toFixed(2)}
      Shipping: ${summary.shipping.toFixed(2)}
      Total: ${summary.total.toFixed(2)}
      
      Proceed with checkout?
    `;

    if (confirm(confirmMessage)) {
      this.processCheckout();
    }
  }
}