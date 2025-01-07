import { Observable } from 'rxjs';
import { User } from '../models/user';

export interface Auth {
  // Observable User stream
  userSource$: Observable<User>;
  logout$: Observable<boolean>;

  /**
   * OAuth login function
   */
  login(): void;

  /**
   * OAuth logout function
   */
  logout(): void;

  /**
   * Check whether there is an active session
   */
  isLoggedIn(): Promise<boolean>;

  getUserInfo(): void;

  getAccessToken(): Promise<string | null>;
}
