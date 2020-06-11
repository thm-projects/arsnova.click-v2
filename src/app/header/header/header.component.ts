import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnDestroy, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
  public static readonly TYPE = 'HeaderComponent';

  private _storage: StorageEstimate;
  private isThemePreview: boolean;

  @ViewChild('connectionIndicatorPopover', { static: true }) private connectionIndicatorPopover: NgbPopover;
  @ViewChild('connectionIndicator', { static: true }) private connectionIndicator: ElementRef<SVGElement>;

  private readonly _destroy = new Subject();

  @Input() public showHeader = true;
  @Input() public logoSize = 'auto';
  @Input() public interactiveLogo = true;

  public isCheckingForUpdates: boolean;

  get storage(): StorageEstimate {
    return this._storage;
  }

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
    const cssClass = (
                       this.isThemePreview || isPlatformServer(this.platformId)
                     ) ? 'fill-success' : //
                     (
                       !this.connectionService.serverAvailable || !this.connectionService.websocketAvailable
                     ) ? 'fill-grey' : //
                     this.connectionService.mediumSpeed ? 'fill-warning' : //
                     this.connectionService.lowSpeed ? 'fill-danger' : //
                     'fill-success';

    this.connectionIndicator.nativeElement.classList.remove(...['fill-danger', 'fill-warning', 'fill-grey', 'fill-success']);
    this.connectionIndicator.nativeElement.classList.add(cssClass);
  }

  public ngOnInit(): void {
    this.isThemePreview = isPlatformBrowser(this.platformId) && location.pathname.startsWith('/preview');
    this.generateConnectionQualityColor();

    this.connectionService.serverStatusEmitter.pipe(distinctUntilChanged(), takeUntil(this._destroy)).subscribe(() => {
      if (!this.showHeader || this.isThemePreview) {
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
    console.log(this.updates);
    if (this.updates.isEnabled) {
      this.updateCheckService.doCheck()
        .then(() => this.updateCheckService.clearCache())
        .catch(err => console.error(err))
        .finally(() => {
          this.isCheckingForUpdates = false;
          this.updateCheckService.reloadPage();
        });
    } else {
      this.updateCheckService.clearCache()
        .catch(err => console.error(err))
        .finally(() => {
          this.isCheckingForUpdates = false;
          this.updateCheckService.reloadPage();
        });
    }
  }

  public round(number: number): number {
    return Math.round(number);
  }
}
