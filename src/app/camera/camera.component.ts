import { MapsService } from './../maps.service';
import { AppModule } from './../app.module';
import { Component, ViewChild, OnInit, ElementRef, NgZone, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamMirrorProperties, WebcamUtil } from 'ngx-webcam';
import { MapsAPILoader } from '@agm/core';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  title: string = 'AGM project';

  // Current Location using google maps
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private ip:MapsService,
  ) { }

  ngOnInit() {
    this.mapsAPILoader.load().then((data) => {
      console.log(data);
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      this.getIP();  
    });
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      }

    });
  }
  //////////////////////////////
/////////IP Address////////////////////
ipAddress:string;

getIP()  
  {  
    this.ip.getIPAddress().subscribe((res:any)=>{  
      this.ipAddress=res.ip;  
    });  
  }  
  ///Web Cam

  public myDate;
  public myDates: any[] = [];


  public webcamImage: WebcamImage = null;
  public imageUrls: any[] = [];
  
  private trigger: Subject<void> = new Subject<void>();
  //public imageInformation: ImageInformation[] = [];
  triggerSnapshot(): void {
    this.trigger.next();
  }
 
  handleImage(webcamImage: WebcamImage): any {   
    this.myDate = Date.now();
    this.myDates.push(this.myDate);
    console.info('Saved webcam image', webcamImage);
    this.webcamImage = webcamImage;
    /*const info = new ImageInformation({
      imageAsBase64: webcamImage.imageAsBase64,
      datetime : this.myDates,
    });*/
   // this.imageInformation.push(info);
    this.imageUrls.push(webcamImage);
    console.log(this.imageUrls);
  }
  //base64Img.

  //   var data:any=document.getElementById('imgUniqe');
  //   data.target='_blank';
  //   data.download='test.jpeg';
  // document.getElementById('imgAk').setAttribute('href', webcamImage.imageAsDataUrl);
  // }   
  ////
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  //new
  /*public pictureTaken = new EventEmitter<WebcamImage>();
  public handleImage(webcamImage: WebcamImage):
  */

  //new

  convertBase64ToBlobData(base64Data: string, contentType: string = 'image/png', sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  downloadImages(base64Data: string) {
    var blob = this.convertBase64ToBlobData(base64Data);
    saveAs(blob, 'attachment');
  }

  deleteImages(i: number): void {    
    this.imageUrls.splice(i,1);
    this.myDates.splice(i,1);   
  }

 

  downloadAllImages() {
    this.imageUrls.forEach(element => {
      var blob = this.convertBase64ToBlobData(element.imageAsBase64);
      saveAs(blob, 'attachment');
    });

  }
}

/*export class ImageInformation {
  public imageAsBase64: string;
  public imageAsDataUrl: string;
  public datetime: any;
  public location: string;

  constructor(data: any) {
    this.imageAsBase64 = data.imageAsBase64;
    this.imageAsDataUrl = data.imageAsDataUrl;
    this.datetime = data.mydates;

  }
}*/
