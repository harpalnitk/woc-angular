import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { UploaderService } from './uploader.service';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
  providers: [ UploaderService ]
})
export class UploaderComponent implements OnInit {
  maxAllowedFileSize = 1 * 1024 * 1024;
  message: string;
  progressValue: number;
  @Input() path = 'default';
  @Input() id = '0';
  @Input() title = 'Choose file to upload';
  @Output() imagePath = new EventEmitter();
  currentClasses: {};
  success = true;
  ngOnInit () {
    this.setCurrentClasses();
  }


  constructor(private uploaderService: UploaderService){}

  onPicked(input: HTMLInputElement) {
    const file = input.files[0];
    if (file && file.size <= this.maxAllowedFileSize ) {
      this.uploaderService.upload(file, this.path, this.id).subscribe(
        msg => {
          input.value = null;
          //console.log(typeof msg)
          if (typeof msg === 'string') {
            this.message = msg + '';
            this.progressValue = null;
          }
          if (typeof msg === 'number') {
            this.progressValue = msg ;
          }
          if (typeof msg === 'object') {
            if (msg.success === true) {
              this.message =  'Upload Successful';
              this.success = true;
              this.imagePath.emit(`http://localhost:4200/${msg.path}`);
            } else {
              this.message =  'Upload Failure. Please try again.';
              this.success = false;
            }
            this.setCurrentClasses();
          }

        }
      );
    } else {
      this.message =  'Max. 1 Mb size files allowed. Please try again';
      this.success = false;
      this.setCurrentClasses();
    }
  }
  setCurrentClasses() {
    // CSS classes: added/removed per current state of component properties
    this.currentClasses =  {
      'text-success': this.success,
      'text-danger': !this.success
    };
  }
}
