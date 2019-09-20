import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppConfigService} from '../../shared/services/app-config.service';

@Component({
  selector: 'app-view-item-selector',
  template: `<mat-form-field>
    <mat-label>View Question</mat-label>
    <mat-select (valueChange)="changed($event)">
      <mat-option value="all">All</mat-option>
      <mat-option value="you_posted">Posted by You</mat-option>
      <mat-option value="you_answered">Answered by you</mat-option>
      <mat-option value="you_liked">Liked by you</mat-option>
    </mat-select>
  </mat-form-field>`
})
export class AppViewItemSelectorComponent {
  @Output() change: EventEmitter<string> = new EventEmitter();
  changed(value: any) {
    console.log("ChangeValue", value);
    this.change.emit(value);
  }
}

@Component({
  selector: 'app-sort-selector',
  template: `<mat-form-field>
    <mat-label>Sort By</mat-label>
    <mat-select (valueChange)="changed($event)">
      <mat-option value="_id">Most Recent</mat-option>
      <mat-option value="view_count">Views</mat-option>
      <mat-option value="answer_count">No. of Answers</mat-option>
      <mat-option value="like_count">Popularity</mat-option>
    </mat-select>
  </mat-form-field>`
})
export class AppSortSelectorComponent {
  @Output() change: EventEmitter<string> = new EventEmitter();
  changed(value: any) {
    console.log("ChangeValue", value);
    this.change.emit(value);
  }
}

@Component({
  selector: 'app-topic-selector',
  template: `<mat-form-field>
    <mat-label>Topic</mat-label>
    <mat-select (valueChange)="changed($event)">
      <mat-option value="1">All</mat-option>
      <mat-option *ngFor="let topic of topics" [value]="topic.value">{{topic.viewValue}}</mat-option>
    </mat-select>
  </mat-form-field>`
})
export class AppTopicSelectorComponent implements OnInit{
  topics;
  constructor(private config: AppConfigService) {}

  ngOnInit(): void {
    this.topics = this.config.getConfig('topics');
  }

  @Output() change: EventEmitter<string> = new EventEmitter();
  changed(value: any) {
    console.log("ChangeValue", value);
    this.change.emit(value);
  }
}

export function getSortViewValue(value) {
  switch (value) {
    case '_id':
      return 'Most Recent';
    case 'like_count':
      return 'No. of Likes';
    case 'view_count':
      return 'No. of Views';
    case 'answer_count':
      return 'No. of Answers';
    default:
      return 'Most Recent';

  }
}


// function dateForViewPage($date_2)
// {
//   $now  = date('Y-m-d H:i:s',time());
//
//
//   $datetime1 = date_create($now );
//   $datetime2 = date_create($date_2);
//
//   $interval = date_diff($datetime1, $datetime2);
//
//   //$months = $interval->format('%m');
//   $days = $interval->format('%a');
//   $hours = $interval->format('%h');
//   $minutes = $interval->format('%i');
//
//   if($days == 0 && $hours == 0){
//     return ($minutes>1) ?  $minutes . " mins ago" : $minutes . " min ago";
//   }
//   else if($days == 0 && $hours < 24){
//     return ($hours>1) ?  $hours . " hours ago" : $hours . " hour ago";
//   }else if ($days < 30){
//     return ($days>1) ?  $days . " days ago" : $days . " day ago";
//   }else{
//     return date_format($datetime2,"Y/m/d");
//   }
// }

export function dateForViewPage(date) {
  let date1 = new Date(date);
  let today = new Date();


  let diffMs = today.getTime() - date1.getTime(); // milliseconds between now & Date
  let diffDays = Math.floor(diffMs / 86400000); // days
  let diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
  let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    if(diffDays == 0 && diffHrs == 0){
    return (diffMins>1) ?  diffMins + " mins ago" : diffMins + " min ago";
  }
  else if(diffDays == 0 && diffHrs < 24){
    return (diffHrs>1) ?  diffHrs + " hours ago" : diffHrs + " hour ago";
  }else if (diffDays < 30){
    return (diffDays>1) ?  diffDays + " days ago" : diffDays + " day ago";
  }else{
    return formatDate(date1);
  }

  function formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
