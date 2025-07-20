// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    // Enable zoneless change detection for better performance with signals
    provideExperimentalZonelessChangeDetection(),

    // Add other providers here as needed
    // provideRouter([]), // If you need routing later
    // provideHttpClient(), // If you need HTTP client
    // provideAnimations(), // If you need animations
  ]
}).catch(err => console.error('Error starting app:', err));
