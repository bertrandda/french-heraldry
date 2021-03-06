import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { MunicipalArmorialPage } from '../pages/municipal-armorial/municipal-armorial';
import { BasesPage } from '../pages/bases/bases';
import { DictionaryPage } from '../pages/dictionary/dictionary';
import { FamilyArmorialPage } from '../pages/family-armorial/family-armorial';
import { SplashPage } from '../pages/splash/splash';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public modalCtrl: ModalController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Accueil', component: HomePage },
      { title: 'Bases', component: BasesPage },
      { title: 'Dictionnaire', component: DictionaryPage },
      // { title: 'Armorial des communes', component: MunicipalArmorialPage },
      { title: 'Armorial des familles', component: FamilyArmorialPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

      let splash = this.modalCtrl.create(SplashPage);
      splash.present();
      // this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
