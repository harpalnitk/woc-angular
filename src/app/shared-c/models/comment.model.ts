import {Deserializable} from '../../shared/models/deserializable.model';


export class Comment implements Deserializable {
  public _id: string;
  public text: string;
  public dateCommented: Date;


  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
