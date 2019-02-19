import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DbTable, StorageKey } from '../../../lib/enums/enums';
import { AddUserComponent } from '../../modals/add-user/add-user.component';
import { AdminService } from '../../service/api/admin/admin.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { StorageService } from '../../service/storage/storage.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss'],
})
export class UserAdminComponent implements OnInit {
  private _data: Array<object>;

  get data(): Array<object> {
    return this._data;
  }

  private _deletingElements: Array<number> = [];

  constructor(
    private userService: UserService,
    private footerBarService: FooterBarService,
    private adminService: AdminService,
    private ngbModal: NgbModal,
    private storageService: StorageService,
  ) {
    this.updateFooterElements();
  }

  public ngOnInit(): void {
    this.adminService.getAvailableUsers().subscribe(data => {
      this._data = data;
    });
  }

  public isDeletingElem(index: number): boolean {
    return this._deletingElements.indexOf(index) > -1;
  }

  public deleteElem(index: number): void {
    this._deletingElements.push(index);
    this.adminService.deleteUser((this._data[index] as any).username).subscribe(() => {
      this._deletingElements.splice(this._deletingElements.indexOf(index), 1);
      this._data.splice(index, 1);
    }, () => {
      this._deletingElements.splice(this._deletingElements.indexOf(index), 1);
    });
  }

  public showAddUserModal(): void {
    this.ngbModal.open(AddUserComponent).result.then(value => {
      value.passwordHash = this.userService.hashPassword(value.name, value.password);
      delete value.password;
      this.adminService.updateUser(value).subscribe(() => {
        this._data.push(value);
      });
    }).catch(() => {});
  }

  public editElem(index: number): void {
    const ref = this.ngbModal.open(AddUserComponent);
    ref.componentInstance.name = (this._data[index] as any).name;
    ref.componentInstance.privateKey = (this._data[index] as any).privateKey;
    ref.componentInstance.gitlabToken = (this._data[index] as any).gitlabToken;
    ref.componentInstance.userAuthorizations = (this._data[index] as any).userAuthorizations;

    ref.result.then(value => {
      value.originalUser = (this._data[index] as any).name;
      value.passwordHash = this.userService.hashPassword(value.name, value.password);
      delete value.password;

      this.adminService.updateUser(value).subscribe(() => {
        (this._data[index] as any).name = value.name;
        (this._data[index] as any).privateKey = value.privateKey;
        (this._data[index] as any).passwordHash = value.passwordHash;
        (this._data[index] as any).gitlabToken = value.gitlabToken;
        (this._data[index] as any).userAuthorizations = value.userAuthorizations;

        if (value.name === this.userService.staticLoginTokenContent.name) {
          localStorage.setItem(StorageKey.PrivateKey, value.privateKey);
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
