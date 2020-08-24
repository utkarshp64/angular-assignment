import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;

  BASE_URL: string;

  constructor(private _appService: AppService, private fb: FormBuilder, private http: HttpClient) {
    this.BASE_URL = window.location.origin;
  }


  get appService(): AppService {
    return this._appService;
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      address: [null, [Validators.required]],
      dob: [null, [Validators.required]],
      company: [null, [Validators.required]],
    });
    this._appService.isLoggedIn.subscribe(value => {
      if (!value) {
        this._appService.navigate('/login');
      } else {
        this._appService.loading(true);
        this.getProfile();
      }
    });
  }

  getProfile(): void {
    const url = this.BASE_URL + '/api/users';
    this.http.get(url).subscribe((response: any) => {
      console.log('User Profile Response', response);
      this.profileForm.patchValue({
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        email: response.data.email,
        address: response.data.address,
        dob: response.data.dob,
        company: response.data.company,
      });
      this._appService.loading(false);
    }, error => {
      console.log('User Profile Error Response', error);
      this._appService.loading(false);
      this.appService.toaster('error', error?.error?.msg, '');
    });
  }

}
