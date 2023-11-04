import { Injectable } from '@angular/core';
import { IProduct, PRODUCTS } from '../data/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsList: IProduct[] = PRODUCTS;

  constructor() { }

  get(): IProduct[] {
    return this.productsList;
  }

  getById(productId: number) {
    return this.productsList.filter(x => x.id === productId)[0];
  }

  add(product: IProduct): IProduct {
    const maxId = Math.max(...this.productsList.map(p => p.id));
    product.id = maxId + 1;

    // let maxInventoryId = Math.max(...product.inventories.map(p => p.id || 0));
    // for (let i = 0; i < product.inventories.length; i++) {
    //   maxInventoryId += 1
    //   product.inventories[i].id = maxInventoryId;
    // }
    let maxInventoryId = 0
    for (let i = 0; i < product.inventories.length; i++) {
      maxInventoryId += 1
      product.inventories[i].id = maxInventoryId;
    }

    this.productsList.push(product);

    return this.getById(product.id);
  }

  edit(product: IProduct) : IProduct {
    const index = this.productsList.findIndex(x => x.id === product.id);

    let maxInventoryId = 0
    for (let i = 0; i < product.inventories.length; i++) {
      maxInventoryId += 1
      product.inventories[i].id = maxInventoryId;
    }

    this.productsList.splice(index, 1, product);

    return this.getById(product.id);
  }
}
