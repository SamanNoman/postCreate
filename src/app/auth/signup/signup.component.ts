import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
signupForm:FormGroup;
isLoading= false;
private authStatusSub: Subscription;
  constructor(public authService: AuthService) { }

  ngOnInit(): void {
   this.authStatusSub= this.authService.getAuthStatusListener().subscribe(
     authStatus => {
       this.isLoading = false;
     }
   );
   this.signupForm = new FormGroup({
      email : new FormControl(null, {validators: [Validators.required]}),
      password : new FormControl("", {validators: [Validators.required]}),
    })
  }

  signup(){

    if(this.signupForm.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(this.signupForm.value.email, this.signupForm.value.password);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
