import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDb } from '../../lib/db/app.db';
import { UserRole } from '../../lib/enums/UserRole';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  private _name = '';
  private _password = '';
  private _gitlabToken = '';
  private _userAuthorizations: Array<string> = [];
  private _isSubmitting: boolean;
  private _privateKey: string;
  private _tokenHash: string;

  get tokenHash(): string {
    return this._tokenHash;
  }

  set tokenHash(value: string) {
    this._tokenHash = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get gitlabToken(): string {
    return this._gitlabToken;
  }

  set gitlabToken(value: string) {
    this._gitlabToken = value;
  }

  get userAuthorizations(): Array<string> {
    return this._userAuthorizations;
  }

  set userAuthorizations(value: Array<string>) {
    this._userAuthorizations = value;
  }

  get isSubmitting(): boolean {
    return this._isSubmitting;
  }

  get privateKey(): string {
    return this._privateKey;
  }

  set privateKey(value: string) {
    this._privateKey = value;
  }

  constructor(private ngbModal: NgbActiveModal) {
    this.privateKey = AppDb.generatePrivateKey();
  }

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
      privateKey: this.privateKey,
      password: this.password,
      tokenHash: this.tokenHash,
      gitlabToken: this.gitlabToken,
      userAuthorizations: this.userAuthorizations,
    });
  }

  public dismiss(): void {
    this.ngbModal.dismiss();
  }
}
