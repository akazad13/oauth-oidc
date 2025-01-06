import { AuthSvcVer } from './models/auth-svc-ver.enum';

export class Constants {
  // Auth service version -> v1: angular-oauth2-oidc | v2: oidc-client based
  public static readonly authSvcVer: AuthSvcVer = AuthSvcVer.V1;

  private static readonly realmName = 'corpauth';
  public static readonly webRoot = 'http://localhost:4200';
  public static readonly idmRoot = 'http://localhost:8080';
  public static readonly authUrl = `${Constants.idmRoot}/realms/${Constants.realmName}`;
  public static readonly redirectV1Uri = `${Constants.webRoot}/todos`;
  public static readonly redirectV2Uri = `${Constants.webRoot}/signin`;
  public static readonly signoutV2Uri = `${Constants.webRoot}/signout`;
  public static readonly userInfoEpUri = `${Constants.authUrl}/protocol/openid-connect/userinfo`;
  public static readonly clientId = 'spa-todos';
  public static readonly scope = 'openid profile email roles';
  public static readonly responseType = 'code'; // CodeFlow + PKCE
}
