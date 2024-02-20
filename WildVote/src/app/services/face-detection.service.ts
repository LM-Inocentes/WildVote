import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaceDetectionService {


  private recognitionResultSubject = new BehaviorSubject<string | null>(null);
  recognitionResult$ = this.recognitionResultSubject.asObservable();
  private takePhotoSubject = new Subject<void>();
  private fileSubject = new BehaviorSubject<File | null>(null);
  file$ = this.fileSubject.asObservable();

  takePhoto$ = this.takePhotoSubject.asObservable();

  triggerTakePhoto() {
    this.takePhotoSubject.next();
  }

  setFile(blob: any | null) {
    const file = new File([blob], 'photo.png', { type: 'image/png' });
    this.fileSubject.next(file);
  }

  setRecognitionResult(result: string | null) {
    this.recognitionResultSubject.next(result);
  }

 
}
