import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/User';
import { HotToastService } from '@ngneat/hot-toast';
import { GET_USERS_URL, LOGIN_URL, REGISTER_URL } from '../shared/apiURLs/URLs';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable: Observable<User>;

  constructor(private http:HttpClient, private hotToastService: HotToastService, private router: Router) {
    this.userObservable = this.userSubject.asObservable();
  }

  login(user: User): Observable<User> {
    return this.http.post<User>(LOGIN_URL, user).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
        }
      })
    );
  }

  register(id: string, Fullname: string, image: File): Observable<User> {
    const uploadData = new FormData();
    uploadData.append('image', image);
    uploadData.append('id', id);
    uploadData.append('Fullname', Fullname);
    return this.http.post<User>(REGISTER_URL, uploadData).pipe(
      this.hotToastService.observe({
        loading: 'Registering...',
        success: 'User Registered',
        error: 'Could Not Register User',
      })
    )
  }

  Logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    this.router.navigateByUrl('/login');
  }

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(GET_USERS_URL);
  }

  //disabled angular.json pre-render and ssr
  setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUserFromLocalStorage(): User {
    const userJson = localStorage.getItem(USER_KEY);
  
    try {
      if (userJson) {
        const user: User = JSON.parse(userJson);
        return user;
      }
    } catch (error) {
      console.error('Error parsing user JSON:', error);
    }
    return new User();
  }

  isAuthenticated(): boolean {
    return (localStorage.getItem(USER_KEY) != null);
  }

  


}
