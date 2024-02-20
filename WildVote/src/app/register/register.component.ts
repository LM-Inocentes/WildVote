import { Component, ElementRef, ViewChild } from '@angular/core';
import { FaceDetectionService } from '../services/face-detection.service';
import { WebcamComponent } from "../components/webcam/webcam.component";
import { Subscription } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from '../shared/models/User';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    imports: [WebcamComponent]
})
export class RegisterComponent {
  @ViewChild('idNumberInput', { static: true }) idNumberInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fullnameInput', { static: true }) fullnameInput!: ElementRef<HTMLInputElement>;
  private imageCaptureSubscription!: Subscription;
  receivedFile!: File | null;

  constructor(private faceDetectionService: FaceDetectionService, private hotToastService: HotToastService, private authservice: AuthService) {}

  ngOnInit() {
    this.imageCaptureSubscription = this.faceDetectionService.file$.subscribe(file => {
      // Do something with the received file
      this.receivedFile = file;
    });
  }

  ngOnDestroy() {
    this.imageCaptureSubscription.unsubscribe();
  }

  toggleSignInMode() {
    const container = document.querySelector('.container');
    container!.classList.remove('sign-up-mode');
  }

  toggleSignUpMode() {
    const container = document.querySelector('.container');
    container!.classList.add('sign-up-mode');
    this.faceDetectionService.triggerTakePhoto();
    this.hotToastService.success('Face Captured');
  }

  toggleSignInMode2() {
    const container = document.querySelector('.container');
    container!.classList.remove('sign-up-mode2');
  }

  toggleSignUpMode2() {
    const container = document.querySelector('.container');
    container!.classList.add('sign-up-mode2');
    
  }

  onFormSubmit(event: Event): void {
    event.preventDefault();
  
    const id = this.idNumberInput.nativeElement.value;
    const fullname = this.fullnameInput.nativeElement.value;
    if (!id || !fullname) {
      this.hotToastService.error('Please Input Required Details');
      return;
  }
    const file: File = this.receivedFile!;
    this.authservice.register(id, fullname, file).subscribe();
  }

}
