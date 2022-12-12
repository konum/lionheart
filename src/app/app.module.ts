import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';
import { ButtonIconComponent } from './components/button-icon/button-icon.component';
import { ComponentsModule } from './components/components.module';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    'pinch': { enable: true }
  }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ComponentsModule
  ],
  exports: [ButtonIconComponent],
  providers: [
    StatusBar,
    SplashScreen,
    NativeAudio,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
