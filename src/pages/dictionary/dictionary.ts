import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as cheerio from 'cheerio';
import axios from 'axios';

@IonicPage()
@Component({
  selector: 'page-dictionary',
  templateUrl: 'dictionary.html',
})
export class DictionaryPage {

  partitionList = [];
  partitionDisplayedList = [];

  partitionUrls = ['https://fr.wikipedia.org/wiki/Partition_h%C3%A9raldique'];

  colorList = [];
  colorDisplayedList = [];

  colorUrls = ['https://fr.wikipedia.org/wiki/Couleur_(h%C3%A9raldique)'];

  chargeList = [];
  chargeDisplayedList = [];

  chargeUrls = ['https://fr.wikipedia.org/wiki/Liste_des_meubles_h%C3%A9raldiques'];

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

    this.partitionUrls.forEach(url => {
      axios.get(url)
        .then(response => {
          $ = cheerio.load(response.data, { xmlMode: true });

          let partitions = [];

          $('.wikitable').each(function (i, elem) {
            let partition = {};
            partition['name'] = $(this).find('tr td b').text();
            partition['imageUrl'] = 'https:' + $(this).find('.image img').attr('src') || '';
            partition['imageUrl'] = partition['imageUrl'].replace(/g\/\d*px/g, 'g/80px');
            partition['description'] = $(this).find('tr').next().html();
            partitions.push(partition);
          })

          this.partitionList.push.apply(this.partitionList, partitions);

          this.updateDisplayedLists();
        });
    });
  }

  private loadColors() {
    let $;

    this.colorUrls.forEach(url => {
      axios.get(url)
        .then(response => {
          $ = cheerio.load(response.data, { xmlMode: true });

          let colors = [];

          $('.wikitable tr').each(function (i, elem) {
            if ($(this).attr('id')) {
              let color = {};
              color['name'] = $(this).find('dl dt').text();
              color['imageUrl'] = 'https:' + $(this).find('.image img').attr('src') || '';
              color['imageUrl'] = color['imageUrl'].replace(/g\/\d*px/g, 'g/80px');
              color['description'] = $(this).find('dl dd').html();
              colors.push(color);
            }
          })

          this.colorList.push.apply(this.colorList, colors);

          this.updateDisplayedLists();
        });
    });
  }

  private loadCharges() {
    let $;

    this.chargeUrls.forEach(url => {
      axios.get(url)
        .then(response => {
          $ = cheerio.load(response.data, { xmlMode: true });

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
                if (charge['imageUrl'] === '') charge['imageUrl'] = 'https:' + next.find('img').attr('src').replace(/g\/\d*px/g, 'g/80px');
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

          this.updateDisplayedLists();
        });
    });
  }

  onSearchChange(event) {
    this.updateDisplayedLists()
  }

  private updateDisplayedLists() {
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
        this.colorDisplayedList.push(item);
      }
    });

    // Charge list update
    this.chargeDisplayedList = [];
    this.chargeList.forEach(item => {
      if (item.name.toLowerCase().includes(this.searchInput.toLowerCase())) {
        this.chargeDisplayedList.push(item);
      }
    });
  }

}
