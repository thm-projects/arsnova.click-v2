import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {HeaderLabelService} from '../../service/header-label.service';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {TrackingService} from '../../service/tracking.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
  public static TYPE = 'InfoComponent';

  private _routerSubscription: Subscription;
  public currentData: string;
  public readonly infoButtons = ['about', 'tos', 'imprint', 'dataprivacy'];

  constructor(
    private footerBarService: FooterBarService,
    private translateService: TranslateService,
    private trackingService: TrackingService,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService
  ) {

    this.footerBarService.TYPE_REFERENCE = InfoComponent.TYPE;

    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemHome,
      this.footerBarService.footerElemTranslation,
      this.footerBarService.footerElemTheme,
      this.footerBarService.footerElemFullscreen,
      this.footerBarService.footerElemHashtagManagement,
      this.footerBarService.footerElemImport,
    ]);

    headerLabelService.headerLabel = 'region.footer.about.title';
  }

  ngOnInit() {
    this._routerSubscription = this.route.data.subscribe(data => {
      this.currentData = data.content;
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

  public toInfoContent(target: string) {
    this.trackingService.trackClickEvent({
      action: InfoComponent.TYPE,
      label: `info-${target}`,
    });
  }
}
