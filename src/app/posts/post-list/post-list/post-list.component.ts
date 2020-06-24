import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Post } from 'src/app/model/post';
import { PostService } from '../../post.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts :Post[] = [];
  private postSub : Subscription;
  totalPost = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  isLoading =false;
  userId: string;
  userIsAuthenticated = false;
  private authStatusSub: Subscription;
  constructor(private postService : PostService, private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPost(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postService.getUpdateListener()
    .subscribe((postData :{posts: Post[],postCount: number}) => {
      this.isLoading = false;
      this.totalPost= postData.postCount
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
   this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(postId : string){
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(()=>{
      this.postService.getPost(this.postPerPage,this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPost(this.postPerPage, this.currentPage);
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  // onEdit(post:Post){
  //   this.router.navigate(['/edit',post.id], { relativeTo: this.route });
  // }


  // posts = [{
  //   title:"First Post", content:"This is the first post"},
  //   {title:"second Post", content:"This is the second post"},
  //   {title:"third Post", content:"This is the third post"},
  //   {title:"Fourth Post", content:"This is the fourth post"}];

}
