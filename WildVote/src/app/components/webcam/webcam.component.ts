import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import { FaceDetectionService } from '../../services/face-detection.service';
import { User } from '../../shared/models/User';
import { AuthService } from '../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-webcam',
  standalone: true,
  imports: [],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss'
})
export class WebcamComponent implements OnInit, OnDestroy{
  WIDTH = 400;
  HEIGHT = 280;
  private MODEL_URL = '../../../assets/models';
  user: User[] = [];

  @ViewChild('video', { static: true })
  public videoElement!: ElementRef;
  @ViewChild('canvas', { static: true })
  public canvasElement!: ElementRef;
  private destroy$ = new Subject<void>();

  constructor(private facedetectionservice: FaceDetectionService, private renderer: Renderer2, private authservice: AuthService) {}
  
  async ngOnInit() {
    
    this.authservice.getUsers().subscribe(users => {
      this.user = users;
    });

    await Promise.all([
      faceapi.loadTinyFaceDetectorModel(this.MODEL_URL),
      faceapi.loadSsdMobilenetv1Model(this.MODEL_URL),
      faceapi.loadFaceRecognitionModel(this.MODEL_URL),
      faceapi.loadFaceLandmarkModel(this.MODEL_URL),
    ]).then(() => this.startWebcam());

    this.facedetectionservice.takePhoto$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.takePhoto());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  stream: any;
  detection: any;
  resizedDetections: any;
  canvas: any;
  canvasEl: any;
  displaySize: any;
  videoInput: any;
  

  async startWebcam() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }

    video.addEventListener('play', async () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      this.renderer.appendChild(this.canvasElement.nativeElement, canvas);

      const displaySize = { width: 440, height: 280 };
      faceapi.matchDimensions(canvas, displaySize);

      const labeledFaceDescriptors = await this.getLabeledFaceDescriptions();
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4);

      setInterval(async () => {
        const face = await faceapi
          .detectSingleFace(video)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!face) {
          return
        }  
        
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        //  Multiple Face Detections
        // const resizedDetections = faceapi.resizeResults([face], { width: video.width, height: video.height });
        
        // const results = resizedDetections.map((d) => {
        //   return faceMatcher.findBestMatch(d.descriptor);
        // });

        // results.forEach((result, i) => {
        //   const box = resizedDetections[i].detection.box;
        //   const drawBox = new faceapi.draw.DrawBox(box, {
        //     label: result.label,
        //   });
        //   drawBox.draw(canvas);
        // });

        // Single Face Detection
        const resizedDetections = faceapi.resizeResults([face], { width: video.width, height: video.height });
        const result = faceMatcher.findBestMatch(resizedDetections[0].descriptor);
        const box = resizedDetections[0].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.label,
        });
        drawBox.draw(canvas);
        this.facedetectionservice.setRecognitionResult(result.label);
      }, 100);
    });
  }

  getLabeledFaceDescriptions() {
    // const labels = ["Felipe", "Messi", "Data"];
    return Promise.all(
      this.user.map(async (user) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const ReferenceFace = await faceapi.fetchImage(`${user.ReferenceFaceURL}`);
          const detections = await faceapi
            .detectSingleFace(ReferenceFace)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections!.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(user.id, descriptions);
      })
    );
  }

  async takePhoto() {
    const video: HTMLVideoElement = this.videoElement.nativeElement;
    const canvas = faceapi.createCanvasFromMedia(video);

    const context = canvas.getContext('2d');
    canvas.width = video.width;
    canvas.height = video.height;

    // Draw the current frame from the video onto the canvas
    context!.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a data URL representing a PNG image
    const blob = await fetch(canvas.toDataURL('image/png')).then(response => response.blob());

    // Create a File object with a specific file name and type
    
    this.facedetectionservice.setFile(blob);
  }

  

  


}

