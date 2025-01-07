import { Injectable } from '@angular/core';
import { UserManager, User, UserManagerSettings, Log } from 'oidc-client';
import { Auth } from '../interface/auth';
import { User as AppUser } from '../models/user';
import { BehaviorSubject, Subject } from 'rxjs';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthV2Service implements Auth {
  private user: User | null = null;
  private appUser!: AppUser;
  private readonly userManager: UserManager;
  private readonly loginChangedSubject = new Subject<boolean>();

  private readonly userSource = new BehaviorSubject(this.appUser);
  userSource$ = this.userSource.asObservable();

  private readonly logoutSubject = new BehaviorSubject(false);
  logout$ = this.logoutSubject.asObservable();

  messageSource = new BehaviorSubject(String());
  messageSource$ = this.messageSource.asObservable();

  loginChanged$ = this.loginChangedSubject.asObservable();

  constructor() {
    const authSettings: UserManagerSettings = {
      authority: Constants.authUrl,
      client_id: Constants.clientId,
      redirect_uri: Constants.redirectV2Uri,
      scope: Constants.scope,
      response_type: Constants.responseType,
      post_logout_redirect_uri: Constants.signoutV2Uri,
      loadUserInfo: true,
    };
    this.userManager = new UserManager(authSettings);

    Log.logger = console;
    Log.level = Log.DEBUG;
  }
  private generateUserInfo(user: User): void {
    if (user && user.profile) {
      const userInfo = user.profile;
      this.appUser = new AppUser(
        userInfo['name']!,
        userInfo['title'],
        userInfo['email']!,
        userInfo['preferred_username']!,
        userInfo['jpegPhoto']
      );

      this.userSource.next(this.appUser);
    }
  }

  getUserInfo(): void {
    // No need to implement for this version
  }

  login() {
    this.userManager.signinRedirect();
  }

  completeLogin() {
    return this.userManager.signinRedirectCallback().then((user) => {
      this.user = user;
      this.loginChangedSubject.next(!!user && !user.expired);

      this.generateUserInfo(user);

      return user;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return this.userManager.getUser().then((user) => {
      const loggedIn = !!user && !user.expired;
      if (this.user !== user) {
        this.loginChangedSubject.next(loggedIn);
      }
      this.user = user;

      this.generateUserInfo(user!);

      return loggedIn;
    });
  }

  logout() {
    this.userManager.signoutRedirect();
  }

  completeLogout() {
    this.user = null;
    return this.userManager.signoutRedirectCallback();
  }

  getAccessToken() {
    return this.userManager.getUser().then((user) => {
      if (!!user && !user.expired) {
        return user.access_token;
      }

      return null;
    });
  }
}
