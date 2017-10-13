import {Component, OnDestroy, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {TranslateService} from '@ngx-translate/core';
import {HeaderLabelService} from '../../service/header-label.service';
import {FooterBarComponent} from '../../footer/footer-bar/footer-bar.component';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
             selector: 'app-info',
             templateUrl: './info.component.html',
             styleUrls: ['./info.component.scss']
           })
export class InfoComponent implements OnInit, OnDestroy {

  private _routerSubscription: Subscription;
  public currentData: string;

  constructor(
    private footerBarService: FooterBarService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private headerLabelService: HeaderLabelService) {
    footerBarService.replaceFooterElments([
                                            FooterBarComponent.footerElemHome,
                                            FooterBarComponent.footerElemTranslation,
                                            FooterBarComponent.footerElemTheme,
                                            FooterBarComponent.footerElemFullscreen,
                                            FooterBarComponent.footerElemHashtagManagement,
                                            FooterBarComponent.footerElemImport,
                                          ]);
    headerLabelService.setHeaderLabel('region.footer.about.title');
  }

  ngOnInit() {
    this._routerSubscription = this.route.data.subscribe(data => {
      this.currentData = data.content;
    });
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }
}
