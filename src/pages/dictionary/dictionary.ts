import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as cheerio from 'cheerio';
import * as jsonframe from 'jsonframe-cheerio';
import axios from 'axios';

@IonicPage()
@Component({
  selector: 'page-dictionary',
  templateUrl: 'dictionary.html',
})
export class DictionaryPage {

  partitionList = [];
  partitionDisplayedList = [];

  partitionUrls = [];
  partitionDevUrls = ['assets/mock_partitions.html'];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DictionaryPage');

    let $;

    this.partitionDevUrls.forEach(url => {
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
            "partitions": {
              "_s": ".wikitable",
              "_d": [{
                "name": "td b",
                "imageUrl": ".image img @ src",
                "description": "tr td || ^[^<].*"
              }]
            }
          }

          let tmpPartition = $('body').scrape(frame, { string: true }).replace(/\[\d?\d?\d\]/g, '')
            .replace(/g\/\d*px/g, 'g/100px');
          
          tmpPartition = JSON.parse(tmpPartition);
          this.partitionList.push.apply(this.partitionList, tmpPartition.partitions);

          this.updateDislpayedLists();
        });
    });
  }

  private updateDislpayedLists() {
    // Partition list update
    this.partitionDisplayedList = [];
    this.partitionList.forEach(item => {
      //   if (item.name.toLowerCase().includes(this.searchInput.toLowerCase()))
      this.partitionDisplayedList.push(item);
    });
    console.log(this.partitionDisplayedList);
  }

}
