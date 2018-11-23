import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as cheerio from 'cheerio';
import * as jsonframe from 'jsonframe-cheerio';
import * as request from 'request';
import axios from 'axios';

/**
 * Generated class for the ArmorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-municipal-armorial',
  templateUrl: 'municipal-armorial.html',
})
export class MunicipalArmorialPage {

  armorialList = [];
  armorialDisplayedList = [];

  armorialUrls = ['https://fr.wikipedia.org/wiki/Armorial_des_communes_de_France'];

  @Input() searchInput: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArmorialPage');

    let $;

    this.armorialUrls.forEach(url => {
      axios.get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      })
        .then(response => {
  
          $ = cheerio.load(response.data);

          jsonframe($);

          $('.wikitable').first().find('li a').each((i, elem) => {
            // TODO remove before release
            if (i > 1) return;
            let $1;
            axios.get('https://fr.wikipedia.org/' + elem.attribs.href, {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
              }
            })
              .then(response => {
        
                $1 = cheerio.load(response.data);

                jsonframe($1);

                let coatsOfArms = [];

                $1('sup').remove();

                $1('.wikitable').each(function (i, elem) {
                  let coatOfArms = {};
                  coatOfArms['name'] = $1(this).find('caption a').text();
                  coatOfArms['imageUrl'] = 'https:' + $1(this).find('.image img').attr('src') || '';
                  coatOfArms['blazon'] = $1(this).find('tbody td span').text();
                  coatOfArms['imageUrl'] = coatOfArms['imageUrl'].replace(/g\/\d*px/g, 'g/80px');
                  coatsOfArms.push(coatOfArms);
                })

                this.armorialList.push.apply(this.armorialList, coatsOfArms);
                this.updateDislpayedList();
              })
          });
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
