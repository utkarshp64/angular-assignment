import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  BASE_PATH: string;

  loginForm: FormGroup;

  loginInvalid = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private appService: AppService) {
    this.BASE_PATH = window.location.origin;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
    });
  }

  onSubmit(): void {
    console.log(this.loginForm.getRawValue());
    const data = this.loginForm.getRawValue();
    this.appService.loading(true);
    if (data.email && data.password) {
      const url = this.BASE_PATH + '/api/login';
      this.http.post(url, JSON.stringify(data)).subscribe((value: any) => {
        console.log('Login Response', value);
        this.appService.isLoggedIn.next(true);
        this.appService.loading(false);
        this.appService.navigate('/home');
        this.appService.toaster('success', value?.msg, 'Login');
      }, error => {
        console.error('Login Error Response', error);
        this.appService.loading(false);
        this.appService.toaster('error', error?.error?.msg, 'Login');
      });
    }
  }

}
