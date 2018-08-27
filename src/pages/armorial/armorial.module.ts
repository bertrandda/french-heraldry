import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArmorialPage } from './armorial';

@NgModule({
  declarations: [
    ArmorialPage,
  ],
  imports: [
    IonicPageModule.forChild(ArmorialPage),
  ],
})
export class ArmorialPageModule {}
