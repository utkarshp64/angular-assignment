import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentComponent } from './payment/payment.component';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  BASE_PATH: string;

  products = [];

  subscription = [];

  isSelected = false;

  constructor(public dialog: MatDialog, private _appService: AppService, private http: HttpClient) {
    this.BASE_PATH = window.location.origin;
  }


  get appService(): AppService {
    return this._appService;
  }

  ngOnInit(): void {
    this.subscribedProduct();
    this.appService.fetchSubscription.subscribe(value => {
      if (value) {
        this.subscribedProduct();
      }
    });
  }

  subscribedProduct(): void {
    this.appService.loading(true);
    const url = this.BASE_PATH + '/api/subscriptions';
    this.http.get(url).subscribe((response: any) => {
      console.log('List of Subscription Response', response);
      this.subscription = response.data;
      this.appService.loading(false);
      this.getProducts();
    }, error => {
      console.log('List of Subscription Response', error);
      this.appService.toaster('error', error?.error?.msg, '');
      this.appService.loading(false);
    });
  }

  getProducts(): void {
    this.appService.loading(true);
    const url = this.BASE_PATH + '/api/products';
    this.http.get(url).subscribe((response: any) => {
      console.log('List of Subscription Response', response);
      this.products = response.data;
      for (const each of this.subscription) {
        for (const item of this.products) {
          if (each.price_id === item.id && each.status === 'active') {
            item.subs = true;
            break;
          }
        }
      }
      console.log(this.products);
      this.appService.loading(false);
    }, error => {
      console.log('List of Subscription Response', error);
      this.appService.loading(false);
      this.appService.toaster('error', error?.error?.msg, '');
    });
  }

  openDialog(): void {
    this.dialog.open(PaymentComponent, {
      disableClose: true,
      closeOnNavigation: true,
    });
  }

  logout(): void {
    this.appService.loading(true);
    const url = this.BASE_PATH + '/api/login';
    this.http.get(url).subscribe((response: any) => {
      this.appService.loading(false);
      this.appService.navigate('/login');
      console.log('Logout Response', response);
      this.appService.toaster('success', response?.msg, 'Logout');
    }, error => {
      console.log('Logout Error Response', error);
      this.appService.loading(false);
      this.appService.toaster('error', error?.error?.msg, 'Logout');
      this.appService.isLoggedIn.next(false);
      this.appService.navigate('/login');
    });
  }

  onSelection($event: MatSelectionListChange, value: object): void {
    console.log('onSelection', value);
    if (value) {
      this.isSelected = true;
      this.appService.product = value;
    } else {
      this.isSelected = false;
    }
  }

  cancel(payload: any): void {
    this.appService.loading(true);
    const data = JSON.stringify({
      product_id: payload?.product_id,
      price_id: payload?.price_id
    });
    this.http.put('/api/subscriptions', data).subscribe((response: any) => {
      this.appService.loading(false);
      this.appService.fetchSubscription.next(response?.data);
      console.log('Cancelled Subscription Response', response);
      this.appService.toaster('success', response?.msg, '');
    }, error => {
      this.appService.loading(false);
      console.error('Cancelled Subscription Error Response', error);
      this.appService.toaster('error', error?.error?.msg, '');
    });
  }
}
