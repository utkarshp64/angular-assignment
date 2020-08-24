import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: []
})
export class SignupComponent implements OnInit {
  BASE_PATH: string;

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private appService: AppService) {
    this.BASE_PATH = window.location.origin;
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      address: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      company: [null, [Validators.required]],
    });
  }

  onSubmit(): void {
    this.appService.loading(true);
    const data = this.registerForm.getRawValue();
    const url = this.BASE_PATH + '/api/users';
    data.dob = this.createDate(data.dob);
    console.log('Data', data);
    this.http.post(url, JSON.stringify(data)).subscribe((value: any) => {
      console.log('Create Account Response', value);
      this.appService.loading(false);
      this.appService.toaster('success', value?.msg, 'Signup');
      this.appService.navigate('/login');
    }, error => {
      this.appService.loading(false);
      console.log('Create Account Error Response', error);
      this.appService.toaster('error', error?.error?.msg, 'Signup');
    });
  }

  createDate(date: Date): string {
    let d: string;
    let m: string;
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    d = dd.toString();
    m = mm.toString();
    if (dd < 10) {
      d = '0' + dd;
    }
    if (mm < 10) {
      m = '0' + mm;
    }
    return yyyy + '-' + m + '-' + d;
  }
}
