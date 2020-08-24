import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  isLoading = new BehaviorSubject(false);

  isLoggedIn = new BehaviorSubject(false);

  fetchSubscription = new BehaviorSubject(null);

  product: any;

  constructor(private router: Router, private cookieService: CookieService, private toastrService: ToastrService) {
  }

  loading(isLoading: boolean): void {
    this.isLoading.next(isLoading);
  }

  navigate(url: string): Promise<boolean> {
    return this.router.navigate([url]);
  }

  checkLogin(): void {
    const session = this.cookieService.get('session');
    console.log('checkLogin', session);
    if (session) {
      this.isLoggedIn.next(true);
      this.navigate('/home');
    } else {
      this.isLoggedIn.next(false);
      this.navigate('/login');
    }
  }

  toaster(type: string, message: string, title?: string): void {
    switch (type) {
      case 'Success':
      case 'success':
      case 'SUCCESS':
        this.toastrService.success(message, title);
        break;
      case 'Info':
      case 'info':
      case 'INFO':
        this.toastrService.info(message, title);
        break;
      case 'Warning':
      case 'warning':
      case 'WARNING':
        this.toastrService.warning(message, title);
        break;
      case 'Error':
      case 'error':
      case 'ERROR':
        this.toastrService.error(message, title);
        break;
      default:
        this.toastrService.info(message, title);
        break;
    }
  }
}
