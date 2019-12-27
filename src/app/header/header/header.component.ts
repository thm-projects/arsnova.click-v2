import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Title } from '../../lib/enums/enums';
import { ConnectionService } from '../../service/connection/connection.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { UpdateCheckService } from '../../service/update-check/update-check.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public static TYPE = 'HeaderComponent';
  @Input() public showHeader = true;
  public isCheckingForUpdates: boolean;
  public readonly logoStyle = {
    height: '60px',
    width: '60px',
  };
  public readonly logoXlStyle = environment.title === Title.Default ? {
    height: '60px',
    width: '60px',
  } : {};

  private _origin: string = isPlatformBrowser(this.platformId) ? location.hostname : '';

  get origin(): string {
    switch (this._origin) {
      case 'beta.arsnova.click':
        return 'Beta';
      case 'staging.arsnova.click':
        return 'Staging';
      default:
        return '';
    }
  }

  private _inHomeRoute: boolean;

  get inHomeRoute(): boolean {
    return this._inHomeRoute;
  }

  set inHomeRoute(value: boolean) {
    this._inHomeRoute = value;
  }

  private _storage: StorageEstimate;

  get storage(): StorageEstimate {
    return this._storage;
  }

  @ViewChild('connectionIndicatorPopover', { static: true }) private connectionIndicatorPopover: NgbPopover;
  @ViewChild('connectionIndicator', { static: true }) private connectionIndicator: ElementRef<SVGElement>;
  private readonly _destroy = new Subject();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public headerLabelService: HeaderLabelService,
    public connectionService: ConnectionService,
    public i18nService: I18nService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private modalService: NgbModal,
    private trackingService: TrackingService,
    private updateCheckService: UpdateCheckService,
    private updates: SwUpdate,
  ) {
  }

  public generateConnectionQualityColor(): void {
    const cssClass = this.connectionService.lowSpeed || //
                     this.connectionService.mediumSpeed ? 'fill-danger' : //
                     (
                       !this.connectionService.serverAvailable || !this.connectionService.websocketAvailable
                     ) ? 'fill-grey' : //
                     'fill-success';

    this.connectionIndicator.nativeElement.classList.remove(...['fill-danger', 'fill-grey', 'fill-success']);
    this.connectionIndicator.nativeElement.classList.add(cssClass);
  }

  public ngOnInit(): void {
    this.generateConnectionQualityColor();

    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(distinctUntilChanged(), takeUntil(this._destroy)).subscribe((url: any) => {
        this.inHomeRoute = (
          location.pathname === '/home' || location.pathname === '/'
        );
      });
    }

    this.connectionService.serverStatusEmitter.pipe(distinctUntilChanged(), takeUntil(this._destroy)).subscribe(() => {
      if (!this.showHeader) {
        return;
      }

      this.generateConnectionQualityColor();

      if (this.connectionService.websocketAvailable || this.headerLabelService.isUnavailableModalOpen) {
        this.connectionIndicatorPopover.close();
      } else {
        this.connectionIndicatorPopover.open();
      }
    });

    new Promise((resolve, reject) => {
      if ('storage' in navigator) {
        navigator.storage.estimate().then(storage => {
          this._storage = storage;
          resolve();
        }).catch(() => reject());
      } else {
        reject();
      }
    }).catch(() => {
      this._storage = {
        quota: 0,
        usage: 0,
      };
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public openConnectionQualityModal(content: TemplateRef<any>): void {
    this.trackingService.trackClickEvent({
      action: 'ConnectionQualityModal',
      label: 'open-dialog',
      customDimensions: {
        dimension1: this.connectionService.lowSpeed,
        dimension2: this.connectionService.mediumSpeed,
        dimension3: this.connectionService.rtt,
        dimension4: this.connectionService.serverAvailable,
        dimension5: this.connectionService.websocketAvailable,
      },
    });

    this.modalService.open(content);
    this.connectionService.calculateRTT();
    if (!this.connectionService.websocketAvailable) {
      this.connectionService.initWebsocket();
    }
  }

  public checkForUpdates(): void {
    this.isCheckingForUpdates = true;
    if (this.updates.isEnabled) {

      this.updateCheckService.doCheck().then(() => {
        this.updateCheckService.clearCache().finally(() => {
          if (this._storage.quota >= this._storage.usage) {
            this.reloadPage();
          }
        });
      }).catch(err => console.error(err)).finally(() => {
        this.isCheckingForUpdates = false;
        this.reloadPage();
      });
    } else {
      this.reloadPage();
    }
  }

  public round(number: number): number {
    return Math.round(number);
  }

  public reloadPage(): void {
    location.reload(true);
  }
}
