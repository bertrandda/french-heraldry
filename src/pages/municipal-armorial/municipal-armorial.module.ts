import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MunicipalArmorialPage } from './municipal-armorial';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MunicipalArmorialPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(MunicipalArmorialPage),
  ],
})
export class MunicipalArmorialPageModule {}
