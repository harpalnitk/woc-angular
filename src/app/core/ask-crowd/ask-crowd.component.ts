import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {AskQuestionComponent} from './ask-question/ask-question.component';
import {Router} from '@angular/router';


@Component({
  selector: 'app-ask-crowd',
  templateUrl: './ask-crowd.component.html',
  styleUrls: ['./ask-crowd.component.scss']
})
export class AskCrowdComponent implements OnInit {
  constructor(public dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AskQuestionComponent, {

      //TODO make it media query dependent
      width: '50vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.router.navigate(['/questions']);
    });
  }
}
