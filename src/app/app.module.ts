import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BasesPage } from '../pages/bases/bases';
import { DictionaryPage } from '../pages/dictionary/dictionary';
import { MunicipalArmorialPage } from '../pages/municipal-armorial/municipal-armorial';
import { FamilyArmorialPage } from '../pages/family-armorial/family-armorial';
import { SplashPage } from '../pages/splash/splash';
import { ItemEmblemListComponent } from '../components/item-emblem-list/item-emblem-list';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BasesPage,
    DictionaryPage,
    MunicipalArmorialPage,
    FamilyArmorialPage,
    SplashPage,
    ItemEmblemListComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
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
