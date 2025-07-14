import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { RootComponent } from './app/root-component/root-component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(RootComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
});
