import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import { FaceDetectionService } from '../../services/face-detection.service';
import { User } from '../../shared/models/User';

@Component({
  selector: 'app-webcam',
  standalone: true,
  imports: [],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss'
})
export class WebcamComponent implements OnInit{
  WIDTH = 400;
  HEIGHT = 280;
  private MODEL_URL = '../../../assets/models';
  user: User[] = [];

  @ViewChild('video', { static: true })
  public videoElement!: ElementRef;
  @ViewChild('canvas', { static: true })
  public canvasElement!: ElementRef;

  constructor(private facedetectionservice: FaceDetectionService, private renderer: Renderer2) {}

  async ngOnInit() {
    
    this.user[0] = {
      isAdmin: false, 
      id: "20-3065-505",
      Fullname: "LM Inocentes",
      ReferenceFaceURL: "https://res.cloudinary.com/de4dinse3/image/upload/v1707901029/npayne9buyxecgfkyxed.jpg"       
    }
    
    this.user[1] = {
      isAdmin: false, 
      id: "22-2222-222",
      Fullname: "Sample",
      ReferenceFaceURL: "https://res.cloudinary.com/de4dinse3/image/upload/v1707901011/cld-sample.jpg"       
    }

    this.user[2] = {
      isAdmin: false, 
      id: "11-1111-111",
      Fullname: "LM Inocentes 2",
      ReferenceFaceURL: "https://res.cloudinary.com/de4dinse3/image/upload/v1708003580/rafhrrzdornzyetszhhd.png"       
    }

    this.user[3] = {
      isAdmin: false, 
      id: "33-3333-333",
      Fullname: "LM Inocentes 2",
      ReferenceFaceURL: "https://res.cloudinary.com/de4dinse3/image/upload/v1708004620/yoqppt4oilb6p2yhfwc0.png"       
    }
    
    await Promise.all([
      faceapi.loadTinyFaceDetectorModel(this.MODEL_URL),
      faceapi.loadSsdMobilenetv1Model(this.MODEL_URL),
      faceapi.loadFaceRecognitionModel(this.MODEL_URL),
      faceapi.loadFaceLandmarkModel(this.MODEL_URL),
    ]).then(() => this.startWebcam());
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


        
        const resizedDetections = faceapi.resizeResults([face], { width: video.width, height: video.height });

        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);

        const results = resizedDetections.map((d) => {
          return faceMatcher.findBestMatch(d.descriptor);
        });
        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, {
            label: result.label,
          });
          drawBox.draw(canvas);
        });

        // // Draw bounding boxes around detected faces
        // faceapi.draw.drawDetections(canvas, resizedDetections);

        // // Draw face landmarks (optional)
        // //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        // const x = resizedDetections[0].detection.box.x;
        // const y = resizedDetections[0].detection.box.y - 20;
        // const descriptorText = bestMatch.label;
        // canvas.getContext('2d')?.fillText(descriptorText, x, y);
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

  


}

