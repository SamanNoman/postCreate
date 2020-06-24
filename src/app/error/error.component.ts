import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { AuthService } from 'src/app/auth/auth.service';
// import { Subscription } from 'rxjs';


@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  // styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  message = "An unknown error occured!"
  // userIsAuthenticated = false;
  // private authListenerSubs: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) { }

  ngOnInit(): void {

  }

}
