import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BonusTokenService} from '../../../../../service/user/bonus-token/bonus-token.service';
import {AttendeeService} from '../../../../../service/attendee/attendee.service';

@Component({
    selector: 'app-bonus-token',
    templateUrl: './bonus-token.component.html',
    styleUrls: ['./bonus-token.component.scss']
})
export class BonusTokenComponent {
    public bonusToken = '## you\'ve been to fast ##';
    public clipboardText: boolean;


    constructor(private activeModal: NgbActiveModal, bonusTokenService: BonusTokenService, attendeeService: AttendeeService) {
        this.bonusToken = attendeeService.bonusToken;
        this.clipboardText = true;
    }

    // https://stackoverflow.com/questions/49102724/angular-5-copy-to-clipboard
    public copy(): void {
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = this.bonusToken;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.clipboardText = false;
        setTimeout(() => { this.clipboardText = true; }, 1000);
    }

    public close(): void {
        this.activeModal.close();
    }


    public abort(): void {
        this.activeModal.dismiss();
    }
}
