import { Component, ElementRef, ViewChild } from '@angular/core';
import { FaceDetectionService } from '../services/face-detection.service'
import { WebcamComponent } from "../components/webcam/webcam.component";

@Component({
    selector: 'app-login',
    standalone: true,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    imports: [WebcamComponent]
})
export class LoginComponent {


  constructor(private faceDetectionService: FaceDetectionService) {}

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

}
