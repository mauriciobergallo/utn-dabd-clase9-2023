import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, filter, from, map, of, tap } from 'rxjs';
import { IProduct } from 'src/app/data/product';
import { ProductsService } from 'src/app/services/products.service';

class ProductRepeatedAsyncValidator {
  static createValidator(productService: ProductsService): AsyncValidatorFn {
    return (c: AbstractControl): Observable<ValidationErrors | null> => {

      return productService.getByName(c.value).pipe(
        map((prod) => {
          // {}
          // { name: 'asdasdasd', price: 200}
          // return prod.name != null ? { repeatedProduct: true } : null;
          return prod.name != null ? { repeatedProduct: true } : null;
        })
      );
    };
  }
}

function matchEmailValidator(
  c: AbstractControl
): { [key: string]: boolean } | null {
  const email = c.get('email');
  const emailConfirm = c.get('confirmEmail');

  if (email!.value !== emailConfirm!.value) {
    return { 'match-email': true };
  }

  return null;
}

@Component({
  selector: 'rf-product-edit-reactive',
  templateUrl: './product-edit-reactive.component.html',
  styleUrls: ['./product-edit-reactive.component.css'],
})
export class ProductEditReactiveComponent {
  productId: number = 0;
  product: IProduct | undefined;
  productForm: FormGroup = new FormGroup({});

  movieNameStream$ = new Observable<string[]>();

  get inventories(): FormArray {
    return this.productForm.get('inventories') as FormArray;
  }

  get emailGroup(): FormGroup {
    return this.productForm.get('emailGroup') as FormGroup;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((p) => {
      this.productId = +p.get('id')!;
      const filteredProduct = this.productService.getById(this.productId);

      this.productForm = this.fb.group({
        name: [
          '',
          [Validators.required, Validators.minLength(3)],
          ProductRepeatedAsyncValidator.createValidator(this.productService),
        ],
        description: ['', [Validators.required, Validators.minLength(15)]],
        emailGroup: this.fb.group(
          {
            shouldValidateEmail: true,
            email: ['', [Validators.required, Validators.email]],
            confirmEmail: ['', [Validators.required, Validators.email]],
          },
          { validators: [matchEmailValidator] }
        ),
        inventories: this.fb.array([]),
      });

      if (filteredProduct) {
        filteredProduct.inventories.forEach((x) => {
          this.inventories.push(
            this.buildInventoryControls(x.location, x.stock)
          );
        });

        this.productForm.patchValue({
          name: filteredProduct.name,
          description: filteredProduct.description,
        });
      }

      this.emailGroup
        .get('shouldValidateEmail')
        ?.valueChanges.subscribe((x) =>
          this.shouldEnableValidationsOnEmailGroup(x)
        );
    });

    const movieNames = [
      'Rambo 1',
      'Rambo 2',
      'Rambo 3',
      'Rocky 1',
      'Rocky 2',
      'Rocky 3',
    ];
    this.movieNameStream$ = of(movieNames);
    // this.movieNameStream$ = new Observable<string[]>(subscriber => {
    //   subscriber.next(['Rambo 1','Rambo 2', 'Rambo 3', 'Rocky 1', 'Rocky 2', 'Rocky 3']);
    //   subscriber.complete();
    // });
  }

  buildInventoryControls(location: string, stock: number) {
    return this.fb.group({
      location: [location, [Validators.required, Validators.minLength(5)]],
      stock: [
        stock,
        [Validators.required, Validators.min(0), Validators.max(50)],
      ],
    });
  }

  addInventory(location: string, stock: number) {
    this.inventories.push(this.buildInventoryControls(location, stock));
  }

  submitForm() {
    this.product = this.productForm.value;
    if (this.productId === 0) {
      // Nuevo producto
      this.product = this.productService.add(this.product!);
    } else {
      // Se está editando el producto
      this.product!.id = this.productId;
      this.product = this.productService.edit(this.product!);
    }

    this.router.navigate(['products']);
  }

  shouldEnableValidationsOnEmailGroup(value: boolean): void {
    if (value) {
      this.emailGroup
        .get('email')
        ?.addValidators([Validators.required, Validators.email]);
      this.emailGroup
        .get('confirmEmail')
        ?.addValidators([Validators.required, Validators.email]);
      this.emailGroup.addValidators(matchEmailValidator);
    } else {
      this.emailGroup.get('email')?.clearValidators();
      this.emailGroup.get('confirmEmail')?.clearValidators();
      this.emailGroup.clearValidators();
    }

    this.emailGroup.get('email')?.updateValueAndValidity();
    this.emailGroup.get('confirmEmail')?.updateValueAndValidity();
    this.emailGroup.updateValueAndValidity();
  }
}
