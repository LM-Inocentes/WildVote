import { Component, ElementRef, ViewChild } from '@angular/core';
import { WebcamComponent } from "../components/webcam/webcam.component";
import { AuthService } from '../services/auth.service';
import { FaceDetectionService } from '../services/face-detection.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from '../shared/models/User';

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [WebcamComponent]
})
export class LoginComponent {

  private recognitionResultSubscription!: Subscription;
  recognitionResult!: string | null;

  constructor(private authservice: AuthService, private facedetectionservice: FaceDetectionService, private router: Router, private hotToastService: HotToastService) {

  }

  ngOnInit() {
    this.recognitionResultSubscription = this.facedetectionservice.recognitionResult$.subscribe(result => {
      this.recognitionResult = result
    });
  }

  ngOnDestroy() {
    this.recognitionResultSubscription.unsubscribe();
  }

  toggleSignInMode() {
    const container = document.querySelector('.container');
    container!.classList.remove('sign-up-mode');
  }

  toggleSignUpMode() {
    const container = document.querySelector('.container');
    container!.classList.add('sign-up-mode');
  }

  toggleSignInMode2() {
    const container = document.querySelector('.container');
    container!.classList.remove('sign-up-mode2');
  }

  toggleSignUpMode2() {
    const container = document.querySelector('.container');
    container!.classList.add('sign-up-mode2');
  }

  onTakePhotoClick() {
    this.facedetectionservice.triggerTakePhoto();
  }

  Login(){
    let nonNullid: string = this.recognitionResult || 'unknown';
    this.authservice.login({id: nonNullid}).pipe(
      this.hotToastService.observe({
        loading: 'Logging In...',
        success: 'Logged In!',
        error: 'User Face No Match',
      })
    ).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
