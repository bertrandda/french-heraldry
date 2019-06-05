import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as cheerio from 'cheerio';
import Utils from '../../app/utils';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DictionaryPage');

    if (!Utils.isApp()) this.storage.clear();
    this.storage.get('partitions-data')
      .then((val) => {
        if (val !== null) {
          this.partitionList = val;
          this.updateDisplayedLists();
        } else {
          this.downloadPartitions();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    this.storage.get('colors-data')
      .then((val) => {
        if (val !== null) {
          this.colorList = val;
          this.updateDisplayedLists();
        } else {
          this.downloadColors();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    this.storage.get('charges-data')
      .then((val) => {
        if (val !== null) {
          this.chargeList = val;
          this.updateDisplayedLists();
        } else {
          this.downloadCharges();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  private downloadPartitions() {
    let $;

    this.partitionUrls.forEach(url => {
      Utils.request(url)
        .then(response => {
          $ = cheerio.load(response.data, { xmlMode: true });

          let partitions = [];

          $('.wikitable').each(function (i, elem) {
            let partition = {};
            partition['name'] = $(this).find('tr td b').text();
            partition['imageUrl'] = 'https:' + $(this).find('.image img').attr('src') || '';
            partition['imageUrl'] = Utils.optimizeImageUrl(partition['imageUrl']);
            partition['description'] = $(this).find('tr').next().html();

            partitions.push(partition);
          })

          this.partitionList.push.apply(this.partitionList, partitions);

          this.updateDisplayedLists();
          this.storage.set('partitions-data', this.partitionList);
        });
    });
  }

  private downloadColors() {
    let $;

    this.colorUrls.forEach(url => {
      Utils.request(url)
        .then(response => {
          $ = cheerio.load(response.data, { xmlMode: true });

          let colors = [];

          $('.wikitable tr').each(function (i, elem) {
            if ($(this).attr('id')) {
              let color = {};
              color['name'] = $(this).find('dl dt').text();
              color['imageUrl'] = 'https:' + $(this).find('.image img').attr('src') || '';
              color['imageUrl'] = Utils.optimizeImageUrl(color['imageUrl']);
              color['description'] = $(this).find('dl dd').html();
              colors.push(color);
            }
          })

          this.colorList.push.apply(this.colorList, colors);

          this.updateDisplayedLists();
          this.storage.set('colors-data', this.colorList);
        });
    });
  }

  private downloadCharges() {
    let $;

    this.chargeUrls.forEach(url => {
      Utils.request(url)
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
                if (charge['imageUrl'] === '') charge['imageUrl'] = 'https:' + Utils.optimizeImageUrl(next.find('img').attr('src'));
              } else {
                charge['description'] += next.html();
              }
              next = next.next();
            }

            if (!(charge['imageUrl'] === '' && charge['description'] === '')) {
              if (charge['imageUrl'] === '') {
                charge['imageUrl'] = 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Blason_%C3%A0_dessiner.svg';
              }
              charges.push(charge);
            }
          })

          this.chargeList.push.apply(this.chargeList, charges);

          this.updateDisplayedLists();
          this.storage.set('charges-data', this.chargeList);
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
