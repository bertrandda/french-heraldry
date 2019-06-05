import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as cheerio from 'cheerio';
import Utils from '../../app/utils';

/**
 * Generated class for the FamilyArmorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-family-armorial',
  templateUrl: 'family-armorial.html',
})
export class FamilyArmorialPage {

  armorialList = [];
  armorialDisplayedList = [];

  armorialUrls = ['https://fr.wikipedia.org/wiki/Armorial_des_familles_de_France'];

  @Input() searchInput: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FamilyArmorialPage');
    if (!Utils.isApp()) this.storage.clear();
    this.storage.get('armorial-data')
      .then((val) => {
        if (val !== null) {
          this.armorialList = val;
          this.updateDislpayedList();
        } else {
          this.downloadData();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSearchChange(event) {
    this.updateDislpayedList()
  }

  private updateDislpayedList() {
    this.armorialDisplayedList = [];
    this.armorialList.forEach(item => {
      if (item.name.toLowerCase().includes(this.searchInput.toLowerCase()))
        this.armorialDisplayedList.push(item);
    });
  }

  private downloadData() {
    let $;

    this.armorialUrls.forEach(url => {
      Utils.request(url)
        .then(response => {

          $ = cheerio.load(response.data, { xmlMode: true });
          let coatsOfArms = [];

          $('sup').remove();

          $('.wikitable tbody tr').each(function (i, elem) {
            if (!Utils.isApp() && i > 10) return;
            if ($(this).find('b').first().text() === 'Figure') return;

            let coatOfArms = {};
            coatOfArms['name'] = $(this).find('b').first().text();
            coatOfArms['imageUrl'] = $(this).find('.image img').attr('src');
            coatOfArms['imageUrl'] = coatOfArms['imageUrl'] ? 'https:' + coatOfArms['imageUrl'] : 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Blason_%C3%A0_dessiner.svg/100px-Blason_%C3%A0_dessiner.svg.png'
            let blazon = $(this).find('td').first().next();

            blazon.find('b').first().remove();
            blazon.find('.floatleft').remove();
            blazon.find('.floatright').remove();
            blazon.find('img').remove();
            blazon.find('.bandeau-niveau-detail').remove();

            coatOfArms['blazon'] = blazon.html();
            coatOfArms['imageUrl'] = Utils.optimizeImageUrl(coatOfArms['imageUrl']);
            coatsOfArms.push(coatOfArms);
          })

          this.armorialList.push.apply(this.armorialList, coatsOfArms);
          this.updateDislpayedList();
          this.storage.set('armorial-data', this.armorialList);
        });
    });
  }

}
