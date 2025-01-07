import { Component, Injector, OnInit } from '@angular/core';
import { Constants } from '../../constants';
import { AuthSvcVer } from '../../models/auth-svc-ver.enum';
import { AuthV1Service } from '../../services/auth-v1.service';
import { AuthV2Service } from '../../services/auth-v2.service';
import { Auth } from '../../interface/auth';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent implements OnInit {
  private readonly authService: Auth;
  constructor(private readonly injector: Injector) {
    if (AuthSvcVer.V1 === Constants.authSvcVer) {
      this.authService = injector.get(AuthV1Service);
    } else {
      this.authService = injector.get(AuthV2Service);
    }
  }

  ngOnInit() {
    this.authService.isLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        this.login();
      }
    });
  }

  login(): void {
    this.authService.login();
  }
}
