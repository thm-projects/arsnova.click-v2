import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { USER_AUTHORIZATION } from '../../shared/enums';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  private _username = '';

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  private _password = '';

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  private _gitlabToken = '';

  get gitlabToken(): string {
    return this._gitlabToken;
  }

  set gitlabToken(value: string) {
    this._gitlabToken = value;
  }

  private _userAuthorizations: Array<string> = [];

  get userAuthorizations(): Array<string> {
    return this._userAuthorizations;
  }

  set userAuthorizations(value: Array<string>) {
    this._userAuthorizations = value;
  }

  private _isSubmitting: boolean;

  get isSubmitting(): boolean {
    return this._isSubmitting;
  }

  constructor(private ngbModal: NgbActiveModal) { }

  public ngOnInit(): void {
  }

  public getUserRoles(): Array<string> {
    return Object.values(USER_AUTHORIZATION);
  }

  public save(): void {
    this._isSubmitting = true;

    if (!this.password || !this.username || !this.userAuthorizations.length) {
      this._isSubmitting = false;
      return;
    }

    this.ngbModal.close({
      username: this.username,
      password: this.password,
      gitlabToken: this.gitlabToken,
      userAuthorizations: this.userAuthorizations,
    });
  }

  public dismiss(): void {
    this.ngbModal.dismiss();
  }

  public hasUserRole(role: string): boolean {
    console.log(this.userAuthorizations.indexOf(role) > -1);
    return this.userAuthorizations.indexOf(role) > -1;
  }
}
