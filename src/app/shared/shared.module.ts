import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../material.module';
import {UploaderComponent} from './uploader/uploader.component';
import {ArrayToStringWithDelimiter} from './pipes/array-to-string-with-delimiter';



@NgModule({
  declarations: [
    UploaderComponent,
    ArrayToStringWithDelimiter,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    UploaderComponent,
    ArrayToStringWithDelimiter,
  ]
})
export class SharedModule {}
