import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

interface Address{
  latitude: number;
  longitude: number;
}
@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private http: HttpClient) {}
   load(){
     return this.http.get<Address>('http://api.ipapi.com/api/check?access_key=592206369f66672328030ec4ca2fec90')
   }
   public getIPAddress()  
  {  
    return this.http.get("http://api.ipify.org/?format=json");  
  }  
}
