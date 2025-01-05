import { Injectable } from '@angular/core';
import { User } from '../models/user';
import {
  AuthConfig,
  JwksValidationHandler,
  OAuthService,
} from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { Constants } from '../constants';
import { Auth } from '../interface/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthV1Service implements Auth {
  private user!: User;

  private readonly userSource = new BehaviorSubject(this.user);
  userSource$ = this.userSource.asObservable();

  constructor(private readonly oauthService: OAuthService) {
    this.configure();
  }

  authConfig: AuthConfig = {
    issuer: Constants.authUrl,
    redirectUri: Constants.redirectV1Uri,
    postLogoutRedirectUri: Constants.webRoot,
    userinfoEndpoint: Constants.userInfoEpUri,
    clientId: Constants.clientId,
    scope: Constants.scope,
    responseType: Constants.responseType,
    disableAtHashCheck: false,
    showDebugInformation: true,
  };

  public login() {
    this.oauthService.initLoginFlow();
  }

  public logout() {
    this.oauthService.logOut();
  }

  public async isLoggedIn(): Promise<boolean> {
    if (this.oauthService.hasValidAccessToken()) {
      const userinfo = await this.oauthService.loadUserProfile();
      console.log(userinfo);
      const loggedIn = !!userinfo;
      return loggedIn;
    } else {
      return new Promise((resolve) => {
        return resolve(false);
      });
    }
  }

  public getUserInfo() {
    if (!this.user) {
      if (this.oauthService.hasValidAccessToken()) {
        this.oauthService.loadUserProfile().then((userInfo: any) => {
          this.user = new User(
            userInfo['name'],
            userInfo['title'],
            userInfo['email'],
            userInfo['preferred_username'],
            userInfo['jpegPhoto']
          );

          this.userSource.next(this.user);
        });
      }
    }
  }

  getAccessToken(): Promise<string> {
    let token = '';
    if (this.oauthService.hasValidAccessToken()) {
      token = this.oauthService.getAccessToken();
    }
    return new Promise((resolve) => {
      return resolve(token);
    });
  }

  private configure() {
    this.oauthService.configure(this.authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }
}
