import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { OAuthModule } from 'angular-oauth2-oidc';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom([
      OAuthModule.forRoot({
        resourceServer: {
          allowedUrls: ['https://localhost:7169/api', 'http://localhost:4200'],
          sendAccessToken: true,
        },
      }),
    ]),
  ],
};
