import {Deserializable} from './deserializable.model';



export class User implements Deserializable {
  public _id: string;
  public alias?: string;
  public password: string;
  public email: string;
  public firstName?: string;
  public lastName?: string;
  public status: string;
  public roles: string [];
  public gender: string;
  public dob?: string;
  public address?: Address;
  public contact?: Contact;
  public userType: string;
  public avatar?: boolean;


  deserialize(input: any) {
    Object.assign(this, input);
    this.contact = new Contact().deserialize(input.contact);
    this.address = input.address ? new Address().deserialize(input.profile) : undefined;
    return this;
  }

  //this cars = input.cars.map((car) => new Car().deserialze(car));   for arrays use this


  getCreated()  {
    const timestamp = this._id.toString().substring(0, 8);
    return new Date( parseInt( timestamp, 16 ) * 1000 );
  }
}

export class Contact implements Deserializable {
  public phones: string [];

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}

export class Address implements Deserializable {
  public lines: string[];
  public city: string;
  public state: string;
  public zip: string;

  deserialize(input: any): this {
    Object.assign(this, input);
    return this;
  }
}

export class UserConstants {
  public static readonly ROLES  = [
    {value: 'U', viewValue: 'User'},
    {value: 'A', viewValue: 'Associate'},
    {value: 'M', viewValue: 'Manager'},
    {value: 'S', viewValue: 'Sr. manager'},
    {value: 'D', viewValue: 'Admin'},
    {value: 'Y', viewValue: 'System Admin'}
  ];
  public static readonly GENDERS = [
    {value: 'M', viewValue: 'Male'},
    {value: 'F', viewValue: 'Female'},
    {value: 'O', viewValue: 'Other'}
  ];
  public static readonly STATUS = [
    {value: '0', viewValue: 'Active'},
    {value: '1', viewValue: 'Inactive'},
    {value: '2', viewValue: 'Disabled'}
  ];
  public static readonly USER_TYPES = [
    {value: 'S', viewValue: 'System User'},
    {value: 'G', viewValue: 'Google User'},
    {value: 'F', viewValue: 'Facebook User'},
    {value: 'T', viewValue: 'Twitter user'}
  ];
}




