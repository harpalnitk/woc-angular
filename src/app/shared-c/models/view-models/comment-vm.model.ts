import {Comment} from '../comment.model';
import {UserQ} from './question-vm.model';

export class CommentVM extends Comment {
  public user?: UserQ;
  public imageURL?: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    this.user = input.user ? new UserQ().deserialize(input.user) : undefined;
    return this;
  }
}
