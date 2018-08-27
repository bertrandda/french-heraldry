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
  selector: 'page-armorial',
  templateUrl: 'armorial.html',
})
export class ArmorialPage {

  armorialList = [];
  armorialDisplayedList = [];

  armorialUrls = [];
  armorialDevUrls = ['assets/mock_armorial_hautes_alpes_wiki.html',
    'assets/mock_armorial_ain_wiki.html'];

  @Input() searchInput: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArmorialPage');

    let $;

    this.armorialDevUrls.forEach(url => {
      axios.get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      })
        .then(response => {
          $ = cheerio.load(response.data);

          jsonframe($) // initializing the plugin

          let frame = {
            "coatsOfArms": {
              "_s": ".wikitable",
              "_d": [{
                "name": "caption a",
                "imageUrl": "img @ src",
                "blazon": "tbody td span"
              }]
            }
          }

          let tmpArmorial = $('body').scrape(frame, { string: true }).replace(/\[\d?\d?\d\]/g, '')
          tmpArmorial = JSON.parse(tmpArmorial);
          this.armorialList.push.apply(this.armorialList, tmpArmorial.coatsOfArms);

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
    console.log(this.armorialDisplayedList);
  }

}
