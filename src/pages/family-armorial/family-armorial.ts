import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import axios from 'axios';
import * as cheerio from 'cheerio';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FamilyArmorialPage');

    let $;

    this.armorialUrls.forEach(url => {
      axios.get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      })
        .then(response => {

          $ = cheerio.load(response.data, { xmlMode: true });
          let coatsOfArms = [];

          $('sup').remove();

          $('.wikitable tbody tr').each(function (i, elem) {
            // TODO remove before release
            if (i > 3) return;
            if ($(this).find('b').first().text() === 'Figure') return;
            let coatOfArms = {};
            coatOfArms['name'] = $(this).find('b').first().text();
            coatOfArms['imageUrl'] = 'https:' + $(this).find('.image img').attr('src') || '';
            let blazon = $(this).find('b').first().parent();
            blazon.find('b').first().remove();
            coatOfArms['blazon'] = blazon;
            coatOfArms['imageUrl'] = coatOfArms['imageUrl'].replace(/g\/\d*px/g, 'g/80px');
            coatsOfArms.push(coatOfArms);
          })

          this.armorialList.push.apply(this.armorialList, coatsOfArms);
          this.updateDislpayedList();
        });
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

}
