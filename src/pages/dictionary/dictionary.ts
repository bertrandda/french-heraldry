import { Component, Input } from '@angular/core';
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

  colorList = [];
  colorDisplayedList = [];

  colorUrls = [];
  colorDevUrls = ['assets/mock_colors.html'];

  chargeList = [];
  chargeDisplayedList = [];

  chargeUrls = [];
  chargeDevUrls = ['assets/mock_meubles.html'];

  dictionaries: string = "partitions";

  @Input() searchInput: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DictionaryPage');

    this.loadPartitions();
    this.loadColors();
    this.loadCharges();
  }

  private loadPartitions() {
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
                "description": "_parent_"
              }]
            }
          }

          let tmpPartition = $('body').scrape(frame, { string: true })
            .replace(/\[\d?\d?\d\]/g, '')
            .replace(/g\/\d*px/g, 'g/80px');

          tmpPartition = JSON.parse(tmpPartition);
          this.partitionList.push.apply(this.partitionList, tmpPartition.partitions);

          this.updateDislpayedLists();
        });
    });
  }

  private loadColors() {
    let $;

    this.colorDevUrls.forEach(url => {
      axios.get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      })
        .then(response => {
          $ = cheerio.load(response.data);

          let colors = [];

          $('.wikitable tr').each(function (i, elem) {
            if ($(this).attr('id')) {
              let color = {};
              color['name'] = $(this).find('dl dt').text();
              color['imageUrl'] = $(this).find('.image img').attr('src') || '';
              color['description'] = $(this).find('dl dd').html();
              colors.push(color);
            }
          })

          this.colorList.push.apply(this.colorList, colors);

          this.updateDislpayedLists();
        });
    });
  }

  private loadCharges() {
    let $;

    this.chargeDevUrls.forEach(url => {
      axios.get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      })
        .then(response => {
          $ = cheerio.load(response.data);

          let charges = [];

          $('#mw-navigation').remove();
          $('.reference').remove();

          $('h3').each(function (i, elem) {
            let charge = {};
            charge['name'] = $(this).find('.mw-headline').text();
            charge['description'] = '';
            charge['imageUrl'] = '';
            let next = $(this).next();

            while (!next.is('h3') && !next.is('h2') && next.html() != null) {
              if (next.hasClass('floatright') || next.hasClass('floatleft') || next.hasClass('thumb tright') || next.hasClass('gallery')) {
                if (charge['imageUrl'] === '') charge['imageUrl'] = next.find('img').attr('src');
              } else {
                charge['description'] += next.html();
              }
              next = next.next();
            }

            if (!(charge['imageUrl'] === '' && charge['description'] === '')) {
              if (charge['imageUrl'] === '') {
                charge['imageUrl'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Blason_%C3%A0_dessiner.svg/80px-Blason_%C3%A0_dessiner.svg.png';
              }
              charges.push(charge);
            }
          })

          this.chargeList.push.apply(this.chargeList, charges);

          this.updateDislpayedLists();
        });
    });
  }

  onSearchChange(event) {
    this.updateDislpayedLists()
  }

  private updateDislpayedLists() {
    // Partition list update
    this.partitionDisplayedList = [];
    this.partitionList.forEach(item => {
      if (item.name.toLowerCase().includes(this.searchInput.toLowerCase()))
        this.partitionDisplayedList.push(item);
    });

    // Color list update
    this.colorDisplayedList = [];
    this.colorList.forEach(item => {
      if (item.name.toLowerCase().includes(this.searchInput.toLowerCase())) {
        if (item.imageUrl) item.imageUrl = item.imageUrl.replace(/g\/\d*px/g, 'g/80px');
        this.colorDisplayedList.push(item);
      }
    });

    // Charge list update
    this.chargeDisplayedList = [];
    this.chargeList.forEach(item => {
      if (item.name.toLowerCase().includes(this.searchInput.toLowerCase())) {
        if (item.imageUrl) item.imageUrl = item.imageUrl.replace(/g\/\d*px/g, 'g/80px');
        this.chargeDisplayedList.push(item);
      }
    });
  }

}
