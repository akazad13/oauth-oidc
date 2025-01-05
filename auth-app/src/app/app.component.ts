import { Component, Injector } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './services/loader.service';
import { Auth } from './interface/auth';
import { AuthSvcVer } from './models/auth-svc-ver.enum';
import { Constants } from './constants';
import { AuthV1Service } from './services/auth-v1.service';
import { AuthV2Service } from './services/auth-v2.service';
import { User } from './models/user';
import { NavComponent } from './components/nav/nav.component';
import { LoderComponent } from './shared/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, LoderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'auth-app';

  constructor(public loaderService: LoaderService) {}
}
