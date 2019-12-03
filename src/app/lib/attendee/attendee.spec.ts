import { IMemberSerialized } from '../interfaces/entities/Member/IMemberSerialized';
import { Attendee } from './attendee';

describe('Attendee', () => {
  let attendee: Attendee;
  const member: IMemberSerialized = {
    id: 'id',
    colorCode: 'colorCode',
    currentQuizName: 'test-quiz',
    groupName: 'groupName',
    name: 'string',
    responses: [],
    ticket: 'ticket',
  };

  beforeEach(() => {
    attendee = new Attendee(member);
  });

  it('should create', () => {
    expect(attendee).toBeTruthy();
  });

  it('should set all correct properties of the attendee', () => {
    expect(attendee.id).toEqual(member.id);
    expect(attendee.colorCode).toEqual(member.colorCode);
    expect(attendee.currentQuizName).toEqual(member.currentQuizName);
    expect(attendee.groupName).toEqual(member.groupName);
    expect(attendee.name).toEqual(member.name);
    expect(attendee.responses).toEqual(member.responses);
    expect(attendee.ticket).toEqual(member.ticket);
  });
});
