import {Question} from '../question.model';
import {Deserializable} from '../../../shared/models/deserializable.model';

export class QuestionVM extends Question {
  public user?: UserQ;
  public topicViewValue?: string;
  public imageURL?: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    this.user = input.user ? new UserQ().deserialize(input.user) : undefined;
    return this;
  }
}


export class UserQ implements Deserializable {
  public avatar: boolean;
  public alias: string;
  public _id: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
