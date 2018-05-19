import {Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {FooterbarElement, FooterBarService} from '../../service/footer-bar.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FileUploadService} from '../../service/file-upload.service';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {TrackingService} from '../../service/tracking.service';
import {isPlatformBrowser} from '@angular/common';

@Component({
  selector: 'app-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent implements OnInit, OnDestroy {
  @Input()
  set footerElements(value: Array<FooterbarElement>) {
    this.hasRightScrollElement = value.length > 1;
    this._footerElements = value;
  }
  get hasRightScrollElement(): boolean {
    return this._hasRightScrollElement;
  }

  set hasRightScrollElement(value: boolean) {
    this._hasRightScrollElement = value;
  }
  get footerElemIndex(): number {
    return this._footerElemIndex;
  }

  set footerElemIndex(value: number) {
    this._footerElemIndex = value;
  }
  public static TYPE = 'FooterBarComponent';

  get footerElements(): Array<FooterbarElement> {
    return this._footerElements;
  }

  private _footerElements: Array<FooterbarElement> = [];

  private _routerSubscription: Subscription;
  private _footerElemIndex = 1;
  private _hasRightScrollElement = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private footerBarService: FooterBarService,
    private currentQuizService: CurrentQuizService,
    private trackingService: TrackingService,
    private fileUploadService: FileUploadService
  ) {
  }

  ngOnInit() {
    this._routerSubscription = this.router.events.subscribe((val) => {
      if (isPlatformBrowser(this.platformId)) {
        const navbarFooter = document.getElementById('navbar-footer-container');
        if (navbarFooter) {
          navbarFooter.scrollLeft = 0;
          this.hideElement('left');
        }
      }
      this.footerElemIndex = 1;
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

  toggleSetting(elem: FooterbarElement): void {
    this.currentQuizService.toggleSetting(elem);
    elem.onClickCallback(elem);
    this.trackingService.trackClickEvent({
      action: this.footerBarService.TYPE_REFERENCE,
      label: `footer-${elem.id}`,
      customDimensions: {
        dimension1: elem.selectable,
        dimension2: elem.isActive
      }
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

  private hideElement(elem: 'left'): void {
    const element = this.getElement(elem);
    element.classList.add('d-none');
    element.classList.remove('d-flex');
  }

  private showElement(elem: 'left'): void {
    const element = this.getElement(elem);
    element.classList.remove('d-none');
    element.classList.add('d-flex');
  }

  private getElement(elem: 'left' | 'right'): Element {
    let className = '';

    switch (elem) {
      case 'left':
        className = 'before';
        break;
      case 'right':
        className = 'after';
        break;
    }

    if (isPlatformBrowser(this.platformId)) {
      return document.getElementsByClassName('footer-bar-wrapper').item(0).getElementsByClassName(className).item(0);
    }

    return null;
  }

  public moveLeft(): void {
    if (isPlatformBrowser(this.platformId)) {
      const navbarFooter = document.getElementById('navbar-footer-container');
      const right = navbarFooter.children.item(--this.footerElemIndex).getBoundingClientRect().right;
      const firstChild = navbarFooter.children.item(1);

      navbarFooter.scrollLeft += right;
      this.hasRightScrollElement = true;

      if (firstChild.getBoundingClientRect().right >= 0) {
        this.hideElement('left');
      }
    }
  }

  public moveRight(): void {
    if (isPlatformBrowser(this.platformId)) {
      const navbarFooter = document.getElementById('navbar-footer-container');
      const right = navbarFooter.children.item(++this.footerElemIndex).getBoundingClientRect().right;
      const lastChild = navbarFooter.children.item(navbarFooter.children.length - 1);

      navbarFooter.scrollLeft += right;
      this.showElement('left');

      if (navbarFooter.scrollLeft >= lastChild.getBoundingClientRect().left) {
        this.hasRightScrollElement = false;
      }
    }
  }
}
