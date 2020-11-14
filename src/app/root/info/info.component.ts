import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DefaultSettings } from '../../lib/default.settings';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit, OnDestroy, AfterViewInit {
  public static readonly TYPE = 'InfoComponent';

  private _markdownFilePostfix: string = environment.markdownFilePostfix;
  private readonly _destroy = new Subject();
  @ViewChild('buttonHeader', { static: true }) private buttonHeader: ElementRef;

  public currentData: string;
  public imprintMarkdownSrc: string;
  public dataPrivacyMarkdownSrc: string;
  public readonly infoButtons: Array<{ id: string, i18nRef: string }> = [];

  constructor(
    private footerBarService: FooterBarService,
    private trackingService: TrackingService,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService,
    private translateService: TranslateService,
  ) {

    headerLabelService.headerLabel = 'region.footer.about.title';
    this.footerBarService.TYPE_REFERENCE = InfoComponent.TYPE;

    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemHome, this.footerBarService.footerElemTranslation, this.footerBarService.footerElemTheme,
    ]);

    if (environment.infoAboutTabEnabled) {
      this.infoButtons.push({
        id: 'about',
        i18nRef: 'region.footer.footer_bar.about',
      });
    }

    this.infoButtons.push(...[
      {
        id: 'tos',
        i18nRef: 'region.footer.footer_bar.tos',
      }, {
        id: 'imprint',
        i18nRef: 'region.footer.footer_bar.imprint',
      }, {
        id: 'dataprivacy',
        i18nRef: 'region.footer.footer_bar.dataprivacy',
      },
    ]);

    this.translateService.onLangChange.pipe(takeUntil(this._destroy)).subscribe((langChanged: LangChangeEvent) => {
      this.buildMarkdownFileSources(langChanged.lang);
    });

    this.buildMarkdownFileSources(this.translateService.currentLang);
  }

  public ngOnInit(): void {
    this.route.data.pipe(distinctUntilChanged(), takeUntil(this._destroy)).subscribe(data => {
      this.currentData = data.content;
    });
  }

  public ngAfterViewInit(): void {
    this.buttonHeader.nativeElement.childNodes.forEach(val => {
      if (!val || !val.classList || !val.classList.contains('btn-primary')) {
        return;
      }

      this.buttonHeader.nativeElement.scrollLeft = val.offsetLeft - val.offsetWidth;
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public toInfoContent(target: string): void {
    this.trackingService.trackClickEvent({
      action: InfoComponent.TYPE,
      label: `info-${target}`,
    });
  }

  public openApiDocsWindow(): void {
    window.open(`${DefaultSettings.httpApiEndpoint}/api-docs/`, '_blank', 'noopener noreferrer');
  }

  public isExternalLinkEnabled(linkName: string): boolean {
    switch (linkName) {
      case 'projectBlog':
        return environment.infoProjectTabEnabled;
      case 'backendApi':
        return environment.infoBackendApiEnabled;
    }
  }

  private buildMarkdownFileSources(lang: string): void {
    this.imprintMarkdownSrc = `/assets/i18n/${lang}.imprint.${this._markdownFilePostfix}.md`;
    this.dataPrivacyMarkdownSrc = `/assets/i18n/${lang}.data_privacy.${this._markdownFilePostfix}.md`;
  }
}
