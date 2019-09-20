import {Deserializable} from '../../shared/models/deserializable.model';

export class Question implements Deserializable {
  public _id: string;
  public text: string;
  public topic: string;
  public contact: Contact;
  public like_count: number;
  public view_count: number;
  public comment_count: number;
  public answer_count: {count: number};

  deserialize(input: any) {
    Object.assign(this, input);
    this.contact = new Contact().deserialize(input.contact);
    return this;
  }



  getCreated()  {
    console.log('get created called');
    const timestamp = this._id.toString().substring(0, 8);
    return new Date( parseInt( timestamp, 16 ) * 1000 );
  }
}

export class Contact implements Deserializable {
  public name: string;
  // public phone: string;
  // public email: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
