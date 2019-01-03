import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { TrackingService } from '../../service/tracking/tracking.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit, OnDestroy {
  public static TYPE = 'InfoComponent';
  public currentData: string;
  public readonly infoButtons = [
    {
      id: 'about',
      i18nRef: 'region.footer.footer_bar.about',
    }, {
      id: 'tos',
      i18nRef: 'region.footer.footer_bar.tos',
    }, {
      id: 'imprint',
      i18nRef: 'region.footer.footer_bar.imprint',
    }, {
      id: 'dataprivacy',
      i18nRef: 'region.footer.footer_bar.dataprivacy',
    },
  ];
  private _routerSubscription: Subscription;

  constructor(
    private footerBarService: FooterBarService,
    private translateService: TranslateService,
    private trackingService: TrackingService,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService,
  ) {

    headerLabelService.headerLabel = 'region.footer.about.title';
    this.footerBarService.TYPE_REFERENCE = InfoComponent.TYPE;

    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemTranslation,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemHashtagManagement,
      this.footerBarService.footerElemImport,
    ]);
  }

  public ngOnInit(): void {
    this._routerSubscription = this.route.data.subscribe(data => {
      this.currentData = data.content;
    });
  }

  public ngOnDestroy(): void {
    this._routerSubscription.unsubscribe();
  }

  public toInfoContent(target: string): void {
    this.trackingService.trackClickEvent({
      action: InfoComponent.TYPE,
      label: `info-${target}`,
    });
  }

  public openApiDocsWindow(): void {
    window.open(`${DefaultSettings.httpApiEndpoint}/api-docs/`);
  }
}
