
export class AttendeeMockService {
  attendees = [];

  getMemberGroups(): Array<string> {
    return ['Default'];
  }

  cleanUp() {

  }

  getOwnNick() {
    return 'own-user-name';
  }
}
