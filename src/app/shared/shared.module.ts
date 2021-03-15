import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

const components = [];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, IonicModule],
  exports: [...components],
})
export class SharedModule { }
