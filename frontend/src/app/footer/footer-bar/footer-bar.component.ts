import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FooterbarElement, FooterBarService} from '../../service/footer-bar.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ActiveQuestionGroupService} from 'app/service/active-question-group.service';
import {FileUploadService} from '../../service/file-upload.service';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent implements OnInit, OnDestroy {

  get _footerElements(): Array<FooterbarElement> {
    return this.footerElements;
  }

  @Input() footerElements: Array<FooterbarElement> = [];

  private _routerSubscription: Subscription;

  constructor(
    private router: Router,
    private footerBarService: FooterBarService,
    private activeQuestionGroupService: ActiveQuestionGroupService,
    private fileUploadService: FileUploadService) {
  }

  ngOnInit() {
    this._routerSubscription = this.router.events.subscribe((val) => {
      if (val.hasOwnProperty('url')) {
        this.footerBarService.footerElemTheme.linkTarget = val['url'].indexOf('lobby') > -1 ? '/quiz/flow/theme' : '/themes';
      }
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

  getLinkTarget(elem: FooterbarElement): void {
    return typeof elem.linkTarget === 'function' ? elem.linkTarget(elem) : elem.linkTarget;
  }

  toggleSetting(elem: FooterbarElement) {
    this.activeQuestionGroupService.toggleSetting(elem);
  }

  public fileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }
    const formData: FormData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      const file: File = fileList[i];
      formData.append('uploadFiles[]', file, file.name);
    }
    this.fileUploadService.uploadFile(formData);
  }
}
