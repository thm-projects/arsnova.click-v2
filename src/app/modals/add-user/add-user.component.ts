import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRole } from '../../../lib/enums/UserRole';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  private _name = '';

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
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
    return Object.values(UserRole);
  }

  public save(): void {
    this._isSubmitting = true;

    if (!this.password || !this.name || !this.userAuthorizations.length) {
      this._isSubmitting = false;
      return;
    }

    this.ngbModal.close({
      name: this.name,
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
