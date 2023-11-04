import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ProductsListComponent } from './products/products-list/products-list.component';
import { ProductEditComponent } from './products/product-edit/product-edit.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductEditReactiveComponent } from './products/product-edit-reactive/product-edit-reactive.component';

const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'products',
    children: [
      { path: '', component: ProductsListComponent },
      // { path: ':id/edit', component: ProductEditComponent },
      { path: ':id/edit', component: ProductEditReactiveComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProductsListComponent,
    ProductEditComponent,
    ProductEditReactiveComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
