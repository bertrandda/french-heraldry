import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BasesPage } from '../pages/bases/bases';
import { BasesPageModule } from '../pages/bases/bases.module';
import { DictionaryPage } from '../pages/dictionary/dictionary';
import { DictionaryPageModule } from '../pages/dictionary/dictionary.module';
import { MunicipalArmorialPage } from '../pages/municipal-armorial/municipal-armorial';
import { MunicipalArmorialPageModule } from '../pages/municipal-armorial/municipal-armorial.module';
import { FamilyArmorialPage } from '../pages/family-armorial/family-armorial';
import { FamilyArmorialPageModule } from '../pages/family-armorial/family-armorial.module';
import { SplashPage } from '../pages/splash/splash';
import { SplashPageModule } from '../pages/splash/splash.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    BasesPageModule,
    DictionaryPageModule,
    MunicipalArmorialPageModule,
    FamilyArmorialPageModule,
    SplashPageModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BasesPage,
    DictionaryPage,
    MunicipalArmorialPage,
    FamilyArmorialPage,
    SplashPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
