import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import {UserService} from "../service/user.service";


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) { }

  canActivate(): boolean {
    if (this.userService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/'])
      return false
    }
  }
}
