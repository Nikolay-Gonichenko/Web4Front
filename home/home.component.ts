import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from "../service/user.service";
import {User} from "../user";
import {TokenService} from "../token/token.service";
import {saveUserName} from "../model/model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string = "";
  password: string = "";
  token: string="";
  constructor(private router: Router, private userService: UserService, private tokenService:TokenService) {
  }

  ngOnInit(): void {

  }

  log(){

    this.userService.log({username: this.username,password: this.password})
      .subscribe((res:any) => {
        this.token = res.token;
        if (this.token!=""){
          this.router.navigate(['/shoot']);
          this.userService.setToken(this.token);
          this.tokenService.saveToken(this.token);
          this.tokenService.saveUser(this.username);
          saveUserName(this.username);
        }else{
          alert("Lol you're slit like whore")
        }

      }, (error: any) => alert("Wrong password"));
    this.password = "";
    this.username = "";
  }


  registration(){

    if (this.username!= "" && this.password!=""){
      this.userService.registration({username: this.username,password: this.password})
        .subscribe((res:any) => {
          this.token = res.token;
          //console.log(this.token);
          if (this.token != ""){
            this.router.navigate(['/shoot']);
            this.userService.setToken(this.token);
            this.tokenService.saveToken(this.token);
            this.tokenService.saveUser(this.username);
            saveUserName(this.username);
          }else {
            alert("Lol you're slit like whore");
          }

        }, (error: any) => alert("This user has already registered"));

      this.username = "";
      this.password = "";
    }else{
      alert("Enter login and password");
    }


  }
}
