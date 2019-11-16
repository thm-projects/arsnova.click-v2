import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-no-data-error',
  templateUrl: './no-data-error.component.html',
  styleUrls: ['./no-data-error.component.scss'],
})
export class NoDataErrorComponent implements OnInit, OnDestroy {

  public target: Array<string>;
  public targetMessage: string;
  public targetButton: string;

  private readonly _destroy = new Subject();

  constructor(private router: Router, private modalRef: NgbActiveModal) {}

  public ngOnInit(): void {
    this.router.events.pipe(takeUntil(this._destroy), filter(event => event instanceof NavigationStart)).subscribe(() => {
      this.modalRef.close();
    });
  }

  public ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  public navigate(): void {
    this.router.navigate(this.target);
  }

  public toHomepage(): void {
    this.router.navigate(['/']);
  }
}
