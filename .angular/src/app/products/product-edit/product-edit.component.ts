import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from 'src/app/data/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'rf-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit{
  product: IProduct | undefined;

  constructor(private activatedRoute: ActivatedRoute, 
    private router: Router,
    private productService: ProductsService) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(p => {
      const productId = +p.get('id')!;
      const filteredProduct = this.productService.getById(productId);
      
      if (filteredProduct) {
        this.product = filteredProduct;
      } else {
        this.product = {
          id: 0,
          name: '',
          description: '',
          inventories: [
            {id: 0, location: '', stock: 0}
          ]
        };
      }
    });
  }

  submitForm(productForm: NgForm) {
    if (this.product?.id === 0) {
      // Nuevo producto
      this.product = this.productService.add(this.product);
    } else {
      // Se está editando el producto
      this.product = this.productService.edit(this.product!);
    }

    this.router.navigate(['products']);
  }
}
