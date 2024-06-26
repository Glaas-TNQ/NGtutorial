import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductComponent,
    CommonModule,
    PaginatorModule,
    EditPopupComponent,
    ButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private productsService: ProductsService) {}

  products: Product[] = [];
  totalRecords: number = 0;
  rows: number = 5;

  displayAddPopup: boolean = false;
  displayEditPopup: boolean = false;

  toggleEditPopup(product: Product) {
    this.selectedProduct = product;
    this.displayEditPopup = true;
  }
  toggleDeletePopup(product: Product) {}

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  selectedProduct: Product = {
    id: 0,
    name: '',
    image: '',
    price: '',
    rating: 0,
  };
  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.id) {
      return;
    }
    this.editProducts(product, this.selectedProduct.id);
    this.displayEditPopup = false;
  }

  onConfirmAdd(product: Product) {
    this.addProducts(product);
    this.displayAddPopup = false;
  }

  onProductOutput(product: Product) {
    console.log(product, 'Output');
  }

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }
  fetchProducts(page: number, perPage: number) {
    this.productsService
      .getProducts('http://localhost:3000/clothes', {
        page,
        perPage,
      })
      .subscribe({
        next: (data: Products) => {
          this.products = data.items;
          this.totalRecords = data.total;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  addProducts(product: Product) {
    this.productsService
      .addProducts('http://localhost:3000/clothes/', product)
      .subscribe({
        next: (data) => {
          this.fetchProducts(0, this.rows);
        },
        error: (data) => {},
      });
  }

  putProducts(product: Product) {
    console.log(product, 'Put');
  }

  deleteProducts(product: Product, id: number) {
    this.productsService
      .deleteProducts('http://localhost:3000/clothes/${id}')
      .subscribe({
        next: (data) => {
          this.fetchProducts(0, this.rows);
        },
        error: (data) => {},
      });
  }

  editProducts(product: Product, id: number) {
    this.productsService
      .editProduct('http://localhost:3000/clothes/${id}', product)
      .subscribe({
        next: (data) => {},
        error: (data) => {},
      });
  }
  ngOnInit() {
    this.fetchProducts(0, this.rows);
  }
}
