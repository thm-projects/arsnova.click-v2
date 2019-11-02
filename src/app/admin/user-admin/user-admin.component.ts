import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserEntity } from '../../../lib/entities/UserEntity';
import { DbTable, StorageKey } from '../../../lib/enums/enums';
import { AddUserComponent } from '../../modals/add-user/add-user.component';
import { AdminApiService } from '../../service/api/admin/admin-api.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { StorageService } from '../../service/storage/storage.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss'],
})
export class UserAdminComponent implements OnInit {
  private _data: Array<UserEntity>;

  get data(): Array<UserEntity> {
    return this._data;
  }

  private _deletingElements: Array<string> = [];

  constructor(
    private userService: UserService,
    private footerBarService: FooterBarService, private adminApiService: AdminApiService,
    private ngbModal: NgbModal,
    private storageService: StorageService,
  ) {
    this.updateFooterElements();
  }

  public ngOnInit(): void {
    this.adminApiService.getAvailableUsers().subscribe(data => {
      this._data = data;
    });
  }

  public isDeletingElem(user: UserEntity): boolean {
    return this._deletingElements.indexOf(user.name) > -1;
  }

  public deleteElem(user: UserEntity): void {
    const index = this._deletingElements.push(user.name) - 1;
    this.adminApiService.deleteUser(user.name).subscribe(() => {
      this._deletingElements.splice(index, 1);
      this._data.splice(this._data.indexOf(user), 1);
    }, error => {
      console.error(error);
    });
  }

  public showAddUserModal(): void {
    this.ngbModal.open(AddUserComponent).result.then(value => {
      value.passwordHash = this.userService.hashPassword(value.name, value.password);
      delete value.password;
      this.adminApiService.updateUser(value).subscribe(() => {
        this._data.push(value);
      });
    }).catch(() => {});
  }

  public editElem(user: UserEntity): void {
    const ref = this.ngbModal.open(AddUserComponent);
    ref.componentInstance.name = user.name;
    ref.componentInstance.privateKey = user.privateKey;
    ref.componentInstance.gitlabToken = user.gitlabToken;
    ref.componentInstance.userAuthorizations = user.userAuthorizations;

    ref.result.then(value => {
      value.originalUser = user.name;
      value.passwordHash = this.userService.hashPassword(value.name, value.password);
      delete value.password;

      this.adminApiService.updateUser(value).subscribe(() => {
        user.name = value.name;
        user.privateKey = value.privateKey;
        user.passwordHash = value.passwordHash;
        user.gitlabToken = value.gitlabToken;
        user.userAuthorizations = value.userAuthorizations;

        if (value.name === this.userService.staticLoginTokenContent.name) {
          sessionStorage.setItem(StorageKey.PrivateKey, value.privateKey);
          this.storageService.create(DbTable.Config, StorageKey.PrivateKey, value.privateKey).subscribe();
        }
      });
    }).catch(() => {});
  }

  private updateFooterElements(): void {
    const footerElements = [
      this.footerBarService.footerElemBack,
    ];

    this.footerBarService.replaceFooterElements(footerElements);
  }
}
