import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DictionaryPage } from './dictionary';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    DictionaryPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(DictionaryPage),
  ],
})
export class DictionaryPageModule {}
