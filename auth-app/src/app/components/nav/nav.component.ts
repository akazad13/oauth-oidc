import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { Auth } from '../../interface/auth';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AlertifyService } from '../../services/alertify.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthSvcVer } from '../../models/auth-svc-ver.enum';
import { Constants } from '../../constants';
import { AuthV1Service } from '../../services/auth-v1.service';
import { AuthV2Service } from '../../services/auth-v2.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, NgIf, BsDropdownModule],
  templateUrl: './nav.component.html',
  styles: `
    .dropdown-toggle,
    .dropdown-item {
      cursor: pointer;
    }

    img {
      max-height: 50px;
      border: 2px solid #fff;
      display: inline;
    }
  `,
})
export class NavComponent implements OnInit {
  model: any = {};
  loggedIn: boolean = false;

  public userInfo: string = '';
  public photo: string = '';

  private readonly authService: Auth;

  constructor(
    private readonly injector: Injector,
    private readonly alertify: AlertifyService
  ) {
    if (AuthSvcVer.V1 === Constants.authSvcVer) {
      this.authService = injector.get(AuthV1Service);
    } else {
      this.authService = injector.get(AuthV2Service);
    }

    this.authService.userSource$.subscribe((user: User) => {
      if (user) {
        this.userInfo = `${user.name} | ${user.title}`;
        this.photo = user.photo;
      }
    });
  }

  ngOnInit() {
    this.userInfo = '';
    this.photo =
      '/9j/4AAQSkZJRgABAQEAkACQAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAA8AEUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8i6KKK/rA8MKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9k=';

    this.authService.isLoggedIn().then((loggedIn) => {
      this.loggedIn = loggedIn;
      if (loggedIn) {
        this.login();
      }
    });
  }

  public login(): void {
    this.authService.login();
  }

  logout() {
    this.alertify.message('Logged Out!');
  }
}