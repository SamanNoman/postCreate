import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Post } from 'src/app/model/post';
import { PostService } from '../../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator'
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
postCreateForm:FormGroup;
imagePreview: string;
isLoading = false;
@Output() postCreated = new EventEmitter<Post>();
title:"";
content:"";
private mode = 'create';
private postId: string;
 post : Post;
 private authStatusSub: Subscription;
//@Output() formChange: EventEmitter<any> = new EventEmitter()
  constructor(private fb:FormBuilder,
    private authService:AuthService ,
     private postService : PostService , public route: ActivatedRoute, public router: Router) {
    // this.newTaskForm = this.fb.group({
    //   enteredTitle : ['', Validators.required],
    //   enteredContent : ['', Validators.required],
    //   image: [null, Validators.required],
    // });
   }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.postCreateForm = new FormGroup({
      image : new FormControl(null, {validators: [Validators.required], asyncValidators : [mimeType]}),
      enteredTitle : new FormControl("", {validators: [Validators.required]}),
       enteredContent : new FormControl("", {validators: [Validators.required]}),
    })
    this.route.paramMap.subscribe((paramMap:ParamMap) => {
      if(paramMap.has('postId')){
        this.mode ='edit';
        this.postId = paramMap.get('postId');
        this. postService.getPosts(this.postId).subscribe(postData =>{
          this.post = {id: postData._id, title: postData.title,
            content:postData.content,
             imagePath: postData.imagePath,
            creator: postData.creator};
          this.postCreateForm.get('enteredTitle').setValue(this.post?.title);
          this.postCreateForm.get('enteredContent').setValue(this.post?.content);
          this.postCreateForm.get('image').setValue(this.post.imagePath);
        });

        // this.newTaskForm.get('enteredTitle').setValue(this.post?.title);
        // this.newTaskForm.get('enteredContent').setValue(this.post?.content);
      }else{
        this.mode = 'create';
        this.postId = null;
      }
    });
    // this.formChange.emit(this.newTaskForm);
    // console.log(this.newTaskForm);
  }

  onAddPost(){
   if(this.postCreateForm.invalid){
     return;
   }
    let posts = new Post();
    // console.log(posts.title);
    // posts.title = this.newTaskForm.get('enterdTitle').value;
    // posts.content = this.newTaskForm.get('enterdContent').value;
    // console.log(posts.title +"  " +posts.content)
     posts.title = this.postCreateForm.get('enteredTitle').value,
      posts.content = this.postCreateForm.get('enteredContent').value;
      this.isLoading = true;
      if(this.mode === 'create'){
     this.postService.addPost(posts.title,posts.content, this.postCreateForm.value.image);
      }else{
        this.postService.updatePost(this.postId,
           posts.title,
          posts.content,
           this.postCreateForm.value.image);
        this.postCreateForm.reset();
      }
  }


  onImagePicked(event: Event){
    const target= event.target as HTMLInputElement;
    const file: File = target.files[0];
    this.postCreateForm.patchValue({image:file});
    this.postCreateForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result as string;

    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
