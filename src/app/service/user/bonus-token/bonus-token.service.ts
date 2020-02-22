import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../user/user.service';
import {DefaultSettings} from '../../../lib/default.settings';
import {Observable} from 'rxjs';
import {StorageKey} from '../../../lib/enums/enums';

@Injectable({
    providedIn: 'root'
})
export class BonusTokenService {
    constructor(private http: HttpClient, private userService: UserService) {
    }

    public getBonusToken(): Observable<string> {
        return this.http.get<string>(`${DefaultSettings.httpApiEndpoint}/member/token/bonus`, {
            headers: {authorization: sessionStorage.getItem(StorageKey.QuizToken)},
        });
    }
}
