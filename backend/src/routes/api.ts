import {Router, Request, Response, NextFunction} from 'express';
import QuizManager, {IActiveQuiz} from '../db/quiz-manager';
import * as fs from 'fs';
import * as path from 'path';
import {IQuestionGroup} from '../interfaces/questions/interfaces';

export class ApiRouter {
  get router(): Router {
    return this._router;
  }

  private static availableNicks: Object = {
    'disney': [
      'Donald Duck',
      'Daisy Duck',
      'Tarzan',
      'Simba',
      'Elsa',
      'Anna',
      'Kuzco',
      'Arielle',
      'Jasmin',
      'Mulan',
      'Pluto',
      'Nemo',
      'Buzz Lightyear',
      'Woody',
      'Lightning McQueen',
      'Tinkerbell',
      'Peter Pan',
      'Cinderella',
      'Dagobert Duck',
      'Goofy'
    ],
    'science': [
      'Edsger Dijkstra',
      'Konrad Zuse',
      'Alan Turing',
      'Galileo Galilei',
      'Johannes Kepler',
      'Blaise Pascal',
      'Christiaan Huygens',
      'Marie Curie',
      'Isaac Newton',
      'Robert Boyle',
      'Gottfried Leibniz',
      'Johannes Gutenberg',
      'Leonardo Fibonacci',
      'André Ampère',
      'Archimedes',
      'Aristoteles',
      'Leonardo Da Vinci',
      'Charles Darwin',
      'Albert Einstein',
      'Euklid'
    ],
    'fantasy': [
      'Harry Potter',
      'Hermione Granger',
      'Ron Weasly',
      'Darren Shan',
      'Gollum',
      'Sauron',
      'Frodo',
      'Arwen',
      'Thorin',
      'John Snow',
      'Robb Stark',
      'Tyrion Lennister',
      'Cersei Lennister',
      'Luke Skywalker',
      'Darth Vader',
      'Obi-Wan Kenobi',
      'Jar-Jar Binks',
      'Ganon',
      'Zelda',
      'Link'
    ],
    'literature': [
      'George Lucas',
      'J.R.R. Tolkien',
      'Joanne K. Rowling',
      'Astrid Lindgren',
      'William Shakespeare',
      'Johann Wolfgang von Goethe',
      'Franz Kafka',
      'Charles Dickens',
      'Erich Kästner',
      'Friedrich von Schiller',
      'Hermann Hesse',
      'Oscar Wilde',
      'Edgar Allan Poe',
      'Mark Twain',
      'Fjodor Dostojewski',
      'Leo Tolstoi',
      'George Orwell',
      'Bertolt Brecht',
      'Michael Ende',
      'Enid Blyton'
    ],
    'mythology': [
      'Zeus',
      'Jupiter',
      'Apollo',
      'Ceres',
      'Chaos',
      'Nyx',
      'Gaia',
      'Erebos',
      'Hermes',
      'Aphrodite',
      'Kerberos',
      'Eldorado',
      'Erasmus',
      'Kanaloa',
      'Setibos',
      'Sukkubus',
      'Ahas',
      'Philippus',
      'Uriel',
      'Onesimus'
    ],
    'actor': [
      'Edward Norton',
      'Alan Rickman',
      'Bud Spencer',
      'Robert De Niro',
      'Kevin Spacey',
      'Johnny Depp',
      'Mads Mikkelsen',
      'Christian Bale',
      'Clint Eastwood',
      'Jack Nicholson',
      'Charlie Chaplin',
      'Harrison Ford',
      'Morgan Freeman',
      'Robin Williams',
      'Tom Hanks',
      'Denzel Washington',
      'Bruce Willis',
      'Ewan McGregor',
      'Brad Pitt',
      'Patrick Steward'
    ],
    'politics': [
      'Barack Obama',
      'Angela Merkel',
      'Kofi Annan',
      'Fidel Castro',
      'Michail Gorbatschow',
      'Elizabeth II.',
      'Benjamin Franklin',
      'Napoleon Bonaparte',
      'Mahatma Gandhi',
      'Lenin',
      'Jeanne d\'Arc',
      'Vlad III. Drăculea',
      'Dschingis Khan',
      'Hernán Cortés',
      'Wladimir Putin',
      'John F. Kennedy',
      'Charles de Gaulle',
      'Willy Brandt',
      'Erich Honecker',
      'Ban Ki-moon'
    ],
    'turing_award': [
      'Martin E. Hellman',
      'Whitfield Diffie',
      'Michael Stonebraker',
      'Leslie Lamport',
      'Shafi Goldwasser',
      'Silvio Micali',
      'Judea Pearl',
      'Leslie Valiant',
      'Charles P. Thacker',
      'Barbara Liskov',
      'Joseph Sifakis',
      'E. Allen Emerson',
      'Edmund M. Clarke',
      'Frances E. Allen',
      'Peter Naur',
      'Robert E. Kahn',
      'Vinton G. Cerf',
      'Alan C. Kay',
      'Leonard Adleman',
      'Adi Shamir',
      'Ronald L. Rivest',
      'Kristen Nygaard',
      'Ole-Johan Dahl',
      'Andrew Yao',
      'Frederick P. Brooks',
      'Jim Gray',
      'Douglas C. Engelbart',
      'Amir Pnueli',
      'Manuel Blum',
      'Raj Reddy',
      'Edward Feigenbaum',
      'Richard E. Stearns',
      'Juris Hartmanis',
      'Butler Lampson',
      'Robin Milner',
      'Fernando José Corbató',
      'William Kahan',
      'Ivan Sutherland',
      'John Cocke',
      'John E. Hopcroft',
      'Richard M. Karp',
      'Niklaus Wirth',
      'Dennis Ritchie',
      'Ken Thompson',
      'Stephen A. Cook',
      'Edgar F. Codd',
      'Tony Hoare',
      'Kenneth E. Iverson',
      'Robert Floyd',
      'John W. Backus',
      'Dana Scott',
      'Michael O. Rabin',
      'Herbert A. Simon',
      'Allen Newell',
      'Donald E. Knuth',
      'Charles Bachman',
      'Edsger W. Dijkstra',
      'John McCarthy',
      'James H. Wilkinson',
      'Marvin Minsky',
      'Richard Hamming',
      'Maurice V. Wilkes',
      'Alan J. Perlis'
    ]
  };
  private _router: Router;

  /**
   * Initialize the ApiRouter
   */
  constructor() {
    this._router = Router();
    this.init();
  }

  /**
   * GET all Data.
   * TODO: Return REST Spec here
   */
  public getAll(req: Request, res: Response, next: NextFunction): void {
    res.send({ab: 'cd'});
  }

  public getIsAvailableQuiz(req: Request, res: Response, next: NextFunction): void {
    const quizzes: Array<string> = Object.keys(QuizManager.getAllActiveQuizzes()).map((value: string) => {
      return QuizManager.getAllActiveQuizzes()[value].name.toLowerCase();
    });
    res.send(quizzes.indexOf(req.params.quizName) > -1);
  }

  public generateDemoQuiz(req: Request, res: Response, next: NextFunction): void {
    try {
      const result: IQuestionGroup = JSON.parse(fs.readFileSync(path.join(__dirname, '../../demo_quiz/de.demo_quiz.json')).toString());
      result.hashtag = 'Demo Quiz ' + (QuizManager.getAllActiveDemoQuizzes().length + 1);
      QuizManager.convertLegacyQuiz(result);
      res.setHeader('Response-Type', 'text/plain');
      res.send(result);
    } catch (ex) {
      res.send(`File IO Error: ${ex}`);
    }
  }

  public getAllAvailableNicks(req: Request, res: Response, next: NextFunction): void {
    res.send(ApiRouter.availableNicks);
  }

  public putOpenLobby(req: Request, res: Response, next: NextFunction): void {
    QuizManager.initActiveQuiz(req.body.quiz);
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'LOBBY:OPENED',
      payload: req.body.quiz
    });
  }

  public putCloseLobby(req: Request, res: Response, next: NextFunction): void {
    const result: boolean = QuizManager.removeActiveQuiz(req.body.quizName);
    const response: Object = {status: `STATUS:${result ? 'SUCCESSFUL' : 'FAILED'}`};
    if (result) {
      Object.assign(response, {
        step: 'LOBBY:CLOSED',
        payload: {}
      });
    }
    res.send(response);
  }

  public putAddMember(req: Request, res: Response, next: NextFunction): void {
    const activeQuiz: IActiveQuiz = QuizManager.getActiveQuizByName(req.body.quizName);
    const result: boolean = activeQuiz.addMember(req.body.nickname, parseInt(req.body.webSocketId, 10));
    const response: Object = {status: `STATUS:${result ? 'SUCCESSFUL' : 'FAILED'}`};
    if (result) {
      Object.assign(response, {
        payload: {
          currentQuestion: activeQuiz.originalObject.questionList[activeQuiz.currentQuestionIndex],
          member: activeQuiz.nicknames[activeQuiz.nicknames.length - 1],
          nicknames: activeQuiz.nicknames
        },
        step: 'LOBBY:MEMBER_ADDED',
      });
    }
    res.send(response);
  }

  public deleteMember(req: Request, res: Response, next: NextFunction): void {
    const activeQuiz: IActiveQuiz = QuizManager.getActiveQuizByName(req.body.quizName);
    const result: boolean = activeQuiz.removeMember(req.body.nickname);
    const response: Object = {status: `STATUS:${result ? 'SUCCESSFUL' : 'FAILED'}`};
    if (result) {
      Object.assign(response, {
        step: 'LOBBY:MEMBER_REMOVED',
        payload: {}
      });
    }
    res.send(response);
  }

  public getAllMembers(req: Request, res: Response, next: NextFunction): void {
    const activeQuiz: IActiveQuiz = QuizManager.getActiveQuizByName(req.params.quizName);
    const names: Array<String> = activeQuiz.originalObject.sessionConfig.nicks.selectedNicks.filter((nick) => {
      return activeQuiz.nicknames.filter((value) => {
        return value.name === nick;
      });
    });
    console.log(names);
    res.send({
      status: 'STATUS:SUCCESSFUL',
      step: 'QUIZ:GET_AVAILABLE_NICKS',
      payload: {nicknames: activeQuiz.nicknames}
    });
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  private init(): void {
    this._router.get('/', this.getAll);

    this._router.get('/getAvailableQuiz/:quizName', this.getIsAvailableQuiz);

    this._router.get('/demoquiz/generate', this.generateDemoQuiz);

    this._router.get('/availableNicks/all', this.getAllAvailableNicks);

    this._router.put('/lobby', this.putOpenLobby);
    this._router.delete('/lobby', this.putCloseLobby);

    this._router.put('/lobby/member', this.putAddMember);
    this._router.delete('/lobby/member', this.deleteMember);

    this._router.get('/quiz/member/:quizName', this.getAllMembers);
  }

}

// Create the ApiRouter, and export its configured Express.Router
const apiRoutes: ApiRouter = new ApiRouter();

export default apiRoutes.router;
