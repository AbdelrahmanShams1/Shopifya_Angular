import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';

export const routes: Routes = [
  {path:'', redirectTo:'home',pathMatch:'full'},
  {path:'home' , component:HomeComponent , title : 'Home page' },
  {path:'cart' , component:CartComponent , title : 'Cart page' },
  {path:'order' , component:OrderComponent , title : 'Order page' },
  {path:'about' , component:HomeComponent , title : 'About page' },
  {path:'login' , component:LoginComponent , title : 'Login page' },
  {path:'register' , component:SignUpComponent , title : 'SingUp page' },
  {path:'admin' , component:AdminPageComponent , title:"Admin"}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled', // يخلي كل صفحة تبدأ من فوق
      anchorScrolling: 'enabled',           // يدعم الـ #id لو استخدمته
      scrollOffset: [0, 0],                 // يخلي البداية من أول الصفحة بالظبط
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
