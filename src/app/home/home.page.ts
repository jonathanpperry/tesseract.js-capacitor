import { Component } from '@angular/core';
import { createWorker } from 'tesseract.js';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { AnalyticsService } from '../services/analytics.service';
const { Camera } = Plugins;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  // Analytics Stuff
  enabled = this.analyticsService.analyticsEnabled;

  worker: Tesseract.Worker;
  workerReady = false;
  image = 'https://tesseract.projectnaptha.com/img/eng_bw.png';
  ocrResult = '';
  captureProgress = 0;
  constructor(private analyticsService: AnalyticsService) {
    this.loadWorker();
  }

  async loadWorker() {
    this.worker = createWorker({
      logger: progress => {
        console.log(progress);
        if (progress.status == 'recognizing text') {
          this.captureProgress = parseInt('' + progress.progress * 100);
        }
      }
    });
    await this.worker.load();
    await this.worker.loadLanguage('jpn');
    await this.worker.initialize('jpn');
    console.log('FIN');
    this.workerReady = true;
  }

  async captureImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    console.log('image: ', image);
    this.image = image.dataUrl;
  }

  async recognizeImage() {
    const result = await this.worker.recognize(this.image);
    console.log(result);
    this.ocrResult = result.data.text;
  }

  // Analytics functionality methods
  setUser() {
    this.analyticsService.setUser();
  }

  setProperty() {
    this.analyticsService.setProperty();
  }

  logEvent() {
    this.analyticsService.logEvent();
  }

  toggleDataCollection() {
    this.analyticsService.toggleAnalytics();
    this.enabled = this.analyticsService.analyticsEnabled;
  }
}
