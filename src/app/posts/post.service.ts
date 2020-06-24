import { Post } from '../model/post';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Route, ActivatedRoute, Router } from '@angular/router';

const BACKEND_URL ="http://localhost:3000/api/posts/"

@Injectable({providedIn : 'root'})
export class PostService{
  private posts : Post[] = [];
  private postUpdated = new Subject<{posts:Post[], postCount: number}>();


  constructor(private http : HttpClient, private route: ActivatedRoute, private router: Router){

  }
  getPost(postPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    console.log(queryParams)
    this.http.get<{message:string, posts : any, maxPosts: number}>(BACKEND_URL + queryParams)
    .pipe(map((postData => {
      return{post: postData.posts.map(post => {
        return {
          title : post.title,
          content : post.content,
          id : post._id,
          imagePath: post.imagePath,
          creator: post.creator,
        };
      }), maxPosts:postData.maxPosts}
    })))
    .subscribe((transformPostData) => {
           this.posts = transformPostData.post;
           this.postUpdated.next({posts:[...this.posts], postCount:transformPostData.maxPosts});
    } )
  }

  getUpdateListener(){
    return this.postUpdated.asObservable();
  }

  getPosts(id : string){
    return this.http.get<{_id:string,
      title:string, content:string,
      imagePath: string,
      creator: string;
    }>(BACKEND_URL+ id);
  }

  updatePost(id:string, title:string,
     content:string, image: File | string){
    let postData: Post | FormData;
    // const post: Post = {id: id, title: title, content: content, imagePath: null};
    if(typeof(image)=== 'object'){
      postData = new FormData();
      postData.append("id", id);
     postData.append("title", title),
     postData.append("content", content),
     postData.append("image", image , title);
    }else{
      postData  = {id: id, title: title,
        content: content, imagePath: image,
        creator : null
      };
    }
    this.http.put(BACKEND_URL+ id, postData)
    .subscribe((response) => {
    //  const updatedPosts = [...this.posts];
    //  const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
    //  const post : Post = {id: id, title: title, content: content, imagePath: ""};
    //  updatedPosts[oldPostIndex] = post;
    //  this.posts = updatedPosts;
    //  this.postUpdated.next([...this.posts]);
    this.router.navigate(['/']);
    })
  }

  addPost(title:string , content: string, image: File){
     const postData = new FormData();
     postData.append("title", title),
     postData.append("content", content),
     postData.append("image", image , title),
       this.http.post<{message:string, post: Post}>(BACKEND_URL, postData)
       .subscribe((responseData) => {
        //  const post: Post = {id: responseData.post.id, title: title,
        //   content:content,
        //   imagePath: responseData.post.imagePath,
        // }
        // //  const postId = responseData.postId;
        // //  post.id = postId;
        //  console.log(responseData.message);
        //  this.posts.push(post);
        //  this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
       });
  }

  deletePost(postId : string){
   return this.http.delete(BACKEND_URL+ postId);
    // .subscribe(() => {
    //   const updatedPost = this.posts.filter(post => post.id !== postId);
    //   this.posts = updatedPost;
    //   this.postUpdated.next([...this.posts]);
    //   console.log("deleted!");
    // })
  }
}
