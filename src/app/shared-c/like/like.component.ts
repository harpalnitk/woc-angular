import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges
} from '@angular/core';
import {SharedCService} from '../services/shared-c.service';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import {UiService} from '../../shared/services/ui.service';

@Component({
  selector: 'app-like',
  templateUrl: './like.component.html',
  styleUrls: ['./like.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LikeComponent implements OnInit, OnDestroy , OnChanges{
  @Output() count = new EventEmitter<number>();

  @Input() category: string;
  @Input() id: string;
  private _like = false;
  like_sub: Subscription;
  likeC_sub: Subscription;
  unLikeC_sub: Subscription;

  auth_sub: Subscription;
  auth = false;


  constructor(private sharedService: SharedCService,
              private cd: ChangeDetectorRef,
              private store: Store<fromRoot.AppState>,
              private uiService: UiService,) {
  }

  ngOnInit() {

   //console.log('ngOnInit BUTTON:', this.text);
    this.auth_sub = this.store.select(fromRoot.getIsAuth).subscribe(
      value => this.auth = value
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
   // console.log('ngOnChanges BUTTON:', this.text);
    if(this.auth){
      this.like_sub = this.sharedService.likeStatus(this.id, this.category).subscribe(
        value => {
          //console.log(`Like Status Value: ${this.text}:`,value);
          this.like = value.like;
          //this.cd.detectChanges();
          this.cd.markForCheck();
        },
        error => {
          console.log('Error in fetching like status');
        }
      );
    }
  }

  get like(): boolean {
    return this._like;
  }

  set like(value: boolean) {
    this._like = value;
  }




  likeC() {
    console.log('like button clicked');
    if(this.auth){
      this.likeC_sub = this.sharedService.like(this.id, this.category).subscribe(
        value => {
          this.like = true;
          this.cd.markForCheck();
          this.count.emit(1);
        },
        error => {
          console.log('Please login to continue');
          this.showMessage('Error! please try again');
        }
      );
    } else {
      this.showMessage('Please login to continue!!');
    }
  }
  unLikeC() {
    console.log('unlike button clicked');
    if(this.auth){
      this.unLikeC_sub = this.sharedService.unLike(this.id, this.category).subscribe(
        value => {
          this.like = false;
          this.cd.markForCheck();
          this.count.emit(-1);
        },
        error => {
          console.log('Please login to continue');
          this.showMessage('Error! please try again');
        }
      );
    } else {
      this.showMessage('Please login to continue!!');
    }
  }

  showMessage(message: string) {
    this.uiService.showSnackBar({message: message});
  }


  ngOnDestroy(): void {
    //console.log('ngOnDestroy BUTTON:', this.text);
    if(this.like_sub) {
      this.like_sub.unsubscribe();
    }
    if(this.likeC_sub) {
      this.likeC_sub.unsubscribe();
    }
    if(this.unLikeC_sub) {
      this.unLikeC_sub.unsubscribe();
    }
    if(this.auth_sub) {
      this.auth_sub.unsubscribe();
    }
  }
}
