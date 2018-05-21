import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IFooterBarElement } from '../../../lib/footerbar-element/interfaces';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss'],
})
export class FooterBarComponent implements OnInit, OnDestroy {
  public static TYPE = 'FooterBarComponent';

  private _footerElements: Array<IFooterBarElement> = [];

  get footerElements(): Array<IFooterBarElement> {
    return this._footerElements;
  }

  @Input()
  set footerElements(value: Array<IFooterBarElement>) {
    this.hasRightScrollElement = value.length > 1;
    this._footerElements = value;
  }

  private _footerElemIndex = 1;

  get footerElemIndex(): number {
    return this._footerElemIndex;
  }

  set footerElemIndex(value: number) {
    this._footerElemIndex = value;
  }

  private _hasRightScrollElement = false;

  get hasRightScrollElement(): boolean {
    return this._hasRightScrollElement;
  }

  set hasRightScrollElement(value: boolean) {
    this._hasRightScrollElement = value;
  }

  private _routerSubscription: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private footerBarService: FooterBarService,
    private currentQuizService: CurrentQuizService,
    private trackingService: TrackingService,
    private fileUploadService: FileUploadService,
  ) {
  }

  public ngOnInit(): void {
    this._routerSubscription = this.router.events.subscribe((val) => {
      if (isPlatformBrowser(this.platformId)) {
        const navbarFooter = document.getElementById('navbar-footer-container');
        if (navbarFooter) {
          navbarFooter.scrollLeft = 0;
        }
      }
      this.footerElemIndex = 1;
      if (val.hasOwnProperty('url')) {
        this.footerBarService.footerElemTheme.linkTarget = val['url'].indexOf('lobby') > -1 ? '/quiz/flow/theme' : '/themes';
      }
    });
  }

  public ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }

  public getLinkTarget(elem: IFooterBarElement): Function | string {
    return typeof elem.linkTarget === 'function' ? elem.linkTarget(elem) : elem.linkTarget;
  }

  public toggleSetting(elem: IFooterBarElement): void {
    this.currentQuizService.toggleSetting(elem);
    elem.onClickCallback(elem);
    this.trackingService.trackClickEvent({
      action: this.footerBarService.TYPE_REFERENCE,
      label: `footer-${elem.id}`,
      customDimensions: {
        dimension1: elem.selectable,
        dimension2: elem.isActive,
      },
    });
  }

  public fileChange(event: any): void {
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

  public moveLeft(): void {
    if (isPlatformServer(this.platformId) || this.footerElemIndex === 1) {
      return;
    }

    const navbarFooter = document.getElementById('navbar-footer-container');
    if (!navbarFooter) {
      this.footerElemIndex--;
      return;
    }

    this.footerElemIndex--;
    if (this.footerElemIndex === 1) {
      navbarFooter.scrollLeft = 0;
    } else {
      const child = navbarFooter.children.item(this.footerElemIndex);
      const childWidth = child.clientWidth;
      navbarFooter.scrollLeft -= (childWidth);
    }
  }

  public moveRight(): void {
    if (isPlatformServer(this.platformId) || this.footerElemIndex === this.footerElements.length - 1) {
      return;
    }

    const navbarFooter = document.getElementById('navbar-footer-container');
    if (!navbarFooter) {
      this.footerElemIndex++;
      return;
    }

    const child = navbarFooter.children.item(this.footerElemIndex);

    if (this.footerElemIndex === 1) {
      const childWidth = child.clientWidth;
      const leftButtonWidth = document.getElementById('footer-move-left').clientWidth;
      navbarFooter.scrollLeft += (childWidth - leftButtonWidth);
    } else {
      navbarFooter.scrollLeft += child.clientWidth;
    }
    this.footerElemIndex++;
  }

  public hideRight(): boolean {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const navbarFooter = document.getElementById('navbar-footer-container');
    if (!navbarFooter) {
      return false;
    }

    const children = navbarFooter.children;
    const lastChildRight = Math.round(children[children.length - 1].getBoundingClientRect().right);
    const containerRight = Math.round(navbarFooter.getBoundingClientRect().right);
    return lastChildRight === containerRight;
  }
}
