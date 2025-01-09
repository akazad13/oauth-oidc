import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
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

  private readonly logoutSubject = new BehaviorSubject(false);
  logout$ = this.logoutSubject.asObservable();

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
    const hasValidAccessToken = this.oauthService.hasValidAccessToken();
    if (hasValidAccessToken) {
      const userinfo = await this.oauthService.loadUserProfile();
      const loggedIn = !!userinfo;
      return loggedIn;
    } else {
      return new Promise((resolve) => {
        return resolve(false);
      });
    }
  }

  public async getUserInfo() {
    if (!this.user) {
      const hasValidAccessToken = this.oauthService.hasValidAccessToken();
      if (hasValidAccessToken) {
        try {
          const userInfo: any = await this.oauthService.loadUserProfile();
          this.user = new User(
            userInfo.info['name'],
            userInfo.info['title'],
            userInfo.info['email'],
            userInfo.info['preferred_username'],
            userInfo.info['jpegPhoto']
          );

          this.userSource.next(this.user);
        } catch (error) {
          this.logoutSubject.next(true);
        }
      } else {
        this.logoutSubject.next(true);
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
    this.oauthService.setupAutomaticSilentRefresh();
  }
}
