import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {TokenService} from "../token/token.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private regUrl: string = "http://localhost:9090/register";
  private authUrl: string = "http://localhost:9090/auth";
  private startUrl: string = "http://localhost:9090/user/start";
  private shootUrl: string = "http://localhost:9090/user/shoot";

  private token:string = "";
  private username:string = "";
  constructor(private http: HttpClient, private tokenService: TokenService) { }



  public registration(obj: any):any{
    return this.http.post(this.regUrl, obj);
  }

  public log(obj: any):any{
    return this.http.post(this.authUrl, obj);
  }

  public isLoggedIn(): boolean {
    return this.token != "";
  }

  public setToken(token:string){
    this.token = token;
  }

  public shoot(data: any): any {
    return this.http.post(this.shootUrl, data);
  }

  public start(){
    this.username = this.tokenService.getUser();
    return this.http.get(this.startUrl);
  }
}
