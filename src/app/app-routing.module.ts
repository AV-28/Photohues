
import { CameraComponent } from './camera/camera.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WebcamModule} from 'ngx-webcam';

const routes: Routes = [{
  component : CameraComponent,
  path : 'camera'
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
   WebcamModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
