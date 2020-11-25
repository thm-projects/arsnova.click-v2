import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrowserVendor } from '../../lib/enums/BrowserVendor';
import { StorageKey } from '../../lib/enums/enums';
import { OperationSystem } from '../../lib/enums/OperationSystem';
import { UpdateCheckService } from '../../service/update-check/update-check.service';

@Component({
  selector: 'app-outdated-version',
  templateUrl: './outdated-version.component.html',
  styleUrls: ['./outdated-version.component.scss'],
})
export class OutdatedVersionComponent implements OnInit {
  private os: OperationSystem;
  private browser: BrowserVendor;

  public step: number;
  public isCheckingForUpdates: boolean;
  public currentVersion: string;
  public targetVersion: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private activeModal: NgbActiveModal,
    private http: HttpClient,
    private updateCheckService: UpdateCheckService,
  ) { }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedVersion = sessionStorage.getItem(StorageKey.OutdatedVersionFunnelStep);
      if (storedVersion === null || isNaN(storedVersion as any)) {
        this.step = 1;
      } else {
        this.step = parseInt(sessionStorage.getItem(StorageKey.OutdatedVersionFunnelStep), 10);
      }

      const app = navigator.appVersion;
      this.os = app.indexOf('Win') !== -1 ? OperationSystem.Windows :
                app.indexOf('Mac') !== -1 ? OperationSystem.Mac :
                app.indexOf('Linux') !== -1 ? OperationSystem.Linux : OperationSystem.Unix;

      const agent = navigator.userAgent;
      this.browser = agent.indexOf('Android') !== -1 ? BrowserVendor.Android :
                     (agent.indexOf('iPhone') !== -1 || agent.indexOf('iPad') !== -1) ? BrowserVendor.iOS :
                     agent.indexOf('Chrome') !== -1 ? BrowserVendor.Chrome :
                     agent.indexOf('Firefox') !== -1 ? BrowserVendor.Firefox : null;
    }
  }

  public abort(): void {
    sessionStorage.setItem(StorageKey.OutdatedVersionFunnelStep, this.targetVersion);
    this.activeModal.close();
  }

  public checkForUpdates(): void {
    this.isCheckingForUpdates = true;
    this.updateCheckService.clearCache()
      .catch(err => console.error(err))
      .finally(() => {
        this.isCheckingForUpdates = false;
        this.reload();
      });
  }

  public reload(): void {
    sessionStorage.setItem(StorageKey.OutdatedVersionFunnelStep, String(this.step + (
      [BrowserVendor.iOS, BrowserVendor.Android].includes(this.browser) ? 2 : 1
    )));
    this.updateCheckService.reloadPage();
  }

  public getFunnel2OsI18nKey(): string {
    switch (this.os) {
      case OperationSystem.Windows:
        return 'component.outdated-version.funnel.2.solution.windows';
      case OperationSystem.Unix:
      case OperationSystem.Linux:
        return 'component.outdated-version.funnel.2.solution.linux';
      case OperationSystem.Mac:
        return 'component.outdated-version.funnel.2.solution.mac';
    }
  }

  public getFunnel3BrowserI18nKeys(): string {
    switch (this.browser) {
      case BrowserVendor.Chrome:
        return 'component.outdated-version.funnel.3.solution.chrome';
      case BrowserVendor.Firefox:
        return 'component.outdated-version.funnel.3.solution.firefox';
      case BrowserVendor.Safari:
        return 'component.outdated-version.funnel.3.solution.safari';
      case BrowserVendor.iOS:
        return 'component.outdated-version.funnel.3.solution.ios';
      case BrowserVendor.Android:
        return 'component.outdated-version.funnel.3.solution.android';
    }
  }


  @HostListener('window:beforeunload', [])
  private updateStep(): void {
    if (this.step === 2) {
      sessionStorage.setItem(StorageKey.OutdatedVersionFunnelStep, String(3));
      return;
    }

    if (this.step === 3) {
      sessionStorage.setItem(StorageKey.OutdatedVersionFunnelStep, String(4));
      return;
    }
  }
}
