import { Component, OnInit } from '@angular/core';
import { IProduct, PRODUCTS } from 'src/app/data/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'rf-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  productList: IProduct[] = [];

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.productList = this.productService.get();
    console.log('Lista', this.productList)
  }

  calculateStock(product: IProduct): number {
    const availableStock = product.inventories.reduce((prev, i) => {
      return (prev += i.stock);
    }, 0);

    return availableStock;
  }
}
