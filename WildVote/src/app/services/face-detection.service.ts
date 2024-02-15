import { Injectable } from '@angular/core';
import * as faceapi from 'face-api.js';

@Injectable({
  providedIn: 'root'
})
export class FaceDetectionService {

  constructor() { }

  private readonly MODEL_URL = '../../../models';

  async loadModels(): Promise<void> {
    await faceapi.nets.ssdMobilenetv1.loadFromUri(this.MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(this.MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(this.MODEL_URL);
  }

  startWebcam(video: HTMLVideoElement): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then((stream) => {
          video.srcObject = stream;
          resolve();
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  getLabeledFaceDescriptions(): Promise<any> {
    const labels = ["Felipe", "Messi", "Data"];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(`./labels/${label}/${i}.png`);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections!.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }

 
}
