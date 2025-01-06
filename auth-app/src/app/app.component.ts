import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './services/loader.service';
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
