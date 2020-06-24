import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
loginForm : FormGroup;
isLoading = false;
private authStatusSub: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub= this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.loginForm = new FormGroup({
      email : new FormControl(null, {validators: [Validators.required]}),
      password : new FormControl("", {validators: [Validators.required]}),
    })
  }

  login(){
    this.isLoading = true;
    if(this.loginForm.invalid){
      return
    }
    this.isLoading = true;
    this.authService.login(this.loginForm.value.email,
      this.loginForm.value.password)
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
