import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SharedCService} from '../../services/shared-c.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import {UiService} from '../../../shared/services/ui.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss']
})
export class CommentBoxComponent implements OnInit, OnDestroy {
  @Output() count = new EventEmitter<number>();
  @Input() category: string;
  @Input() id: string;
  auth_sub: Subscription;
  post_sub: Subscription;
  auth = false;

  constructor(private sharedService: SharedCService,
              private cd: ChangeDetectorRef,
              private store: Store<fromRoot.AppState>,
              private uiService: UiService,) { }

  ngOnInit() {
    //console.log('ngOnInit BUTTON:', this.text);
    this.auth_sub = this.store.select(fromRoot.getIsAuth).subscribe(
      value => this.auth = value
    );
  }

  ngOnDestroy(): void {
    if(this.auth_sub) {
      this.auth_sub.unsubscribe();
    }
  }

  post(input: string) {
    console.log('Comment: ', input);
    if(this.auth){
      this.post_sub = this.sharedService.postComment(this.id, this.category, input).subscribe(
        value => {
          //this.like = false;
          //this.cd.markForCheck();
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

  showMessage(message: string) {
    this.uiService.showSnackBar({message: message});
  }
}
