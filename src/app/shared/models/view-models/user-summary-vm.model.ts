
export class UserSummaryVM {

constructor(
  private _id: string,
  public email: string,
  public roles: string [],
  private _token: string,
  private _tokenExpirationDate: Date,
  public alias?: string,
  public avatar?: boolean,
) {}
  get id() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._id;
  }
  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  getTokenForSignOut() {
    return this._token;
  }
}








