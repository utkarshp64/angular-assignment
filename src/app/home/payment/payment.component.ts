import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  cardForm: FormGroup;

  selectedProduct: string;

  constructor(private fb: FormBuilder, private appService: AppService, private http: HttpClient, private dialogRef: MatDialogRef<PaymentComponent>) {
  }

  ngOnInit(): void {
    this.cardForm = this.fb.group({
      card_number: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      exp_month: ['', [Validators.required]],
      exp_year: ['', [Validators.required]],
      cvv_number: ['', [Validators.required]]
    });
    this.selectedProduct = this.appService.product?.metadata?.nickname;
  }

  onSubmit(): void {
    this.appService.loading(true);
    const data = this.cardForm.getRawValue();
    console.log('Selected Subscription: ', this.appService.product);
    data.product_id = this.appService.product?.id;
    console.log('cardForm', data);
    const payload = btoa(JSON.stringify(data));
    this.http.post('/api/subscriptions', payload).subscribe((response: any) => {
      this.appService.loading(false);
      this.appService.fetchSubscription.next(response?.data);
      console.log('Create Subscription Response', response);
      this.dialogRef.close();
      this.appService.toaster('success', response?.msg, '');
    }, error => {
      this.appService.loading(false);
      console.error('Create Subscription Error Response', error);
      this.appService.toaster('error', error?.error?.msg, '');
    });
  }
}
