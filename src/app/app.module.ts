import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
// environments
import { environment } from '../environments/environment';
// angular fire
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { SharedModule } from './shared/shared.module';
// ionic
import { Firebase } from '@ionic-native/firebase/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// drag drop
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        SharedModule,
        BrowserAnimationsModule,
        DragDropModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
    ],
    providers: [
        Firebase,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
