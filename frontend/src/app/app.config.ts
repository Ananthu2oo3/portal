
// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient, withFetch  } from '@angular/common/http';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { routes } from './app.routes';
// // import { provideForms } from '@angular/forms'; // ✅ This is all you need

// export const config = {
//   providers: [provideRouter(routes)],
// };

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(withFetch()),
//     provideAnimations(),
//     // provideForms() // ✅ Enables [(ngModel)]
//   ]
// };

import { ApplicationConfig, provideZoneChangeDetection   } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule , provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideHttpClient(withFetch()), // This must come before any HTTP-dependent services
    provideAnimations(),
  ]
};