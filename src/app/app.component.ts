import { Component, OnInit } from '@angular/core';
import { Post } from './model/post';
import { AuthService } from './auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'postCreate';
  constructor(private authService : AuthService){}

  ngOnInit(){
this.authService.autoAuthUser();
  }

}
