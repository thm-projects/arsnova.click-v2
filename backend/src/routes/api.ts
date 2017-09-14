import {Router, Request, Response, NextFunction} from 'express';

export class ApiRouter {
    router: Router;

    /**
     * Initialize the ApiRouter
     */
    constructor() {
        this.router = Router();
        this.init();
    }

    /**
     * GET all Data.
     */
    public getAll(req: Request, res: Response, next: NextFunction) {
        res.send({ab: 'cd'});
    }

    public getAllAvailableNicks(req: Request, res: Response, next: NextFunction) {
        res.send(
            {
                "disney": [
                    "Donald Duck",
                    "Daisy Duck",
                    "Tarzan",
                    "Simba",
                    "Elsa",
                    "Anna",
                    "Kuzco",
                    "Arielle",
                    "Jasmin",
                    "Mulan",
                    "Pluto",
                    "Nemo",
                    "Buzz Lightyear",
                    "Woody",
                    "Lightning McQueen",
                    "Tinkerbell",
                    "Peter Pan",
                    "Cinderella",
                    "Dagobert Duck",
                    "Goofy"
                ],
                "science": [
                    "Edsger Dijkstra",
                    "Konrad Zuse",
                    "Alan Turing",
                    "Galileo Galilei",
                    "Johannes Kepler",
                    "Blaise Pascal",
                    "Christiaan Huygens",
                    "Marie Curie",
                    "Isaac Newton",
                    "Robert Boyle",
                    "Gottfried Leibniz",
                    "Johannes Gutenberg",
                    "Leonardo Fibonacci",
                    "André Ampère",
                    "Archimedes",
                    "Aristoteles",
                    "Leonardo Da Vinci",
                    "Charles Darwin",
                    "Albert Einstein",
                    "Euklid"
                ],
                "fantasy": [
                    "Harry Potter",
                    "Hermione Granger",
                    "Ron Weasly",
                    "Darren Shan",
                    "Gollum",
                    "Sauron",
                    "Frodo",
                    "Arwen",
                    "Thorin",
                    "John Snow",
                    "Robb Stark",
                    "Tyrion Lennister",
                    "Cersei Lennister",
                    "Luke Skywalker",
                    "Darth Vader",
                    "Obi-Wan Kenobi",
                    "Jar-Jar Binks",
                    "Ganon",
                    "Zelda",
                    "Link"
                ],
                "literature": [
                    "George Lucas",
                    "J.R.R. Tolkien",
                    "Joanne K. Rowling",
                    "Astrid Lindgren",
                    "William Shakespeare",
                    "Johann Wolfgang von Goethe",
                    "Franz Kafka",
                    "Charles Dickens",
                    "Erich Kästner",
                    "Friedrich von Schiller",
                    "Hermann Hesse",
                    "Oscar Wilde",
                    "Edgar Allan Poe",
                    "Mark Twain",
                    "Fjodor Dostojewski",
                    "Leo Tolstoi",
                    "George Orwell",
                    "Bertolt Brecht",
                    "Michael Ende",
                    "Enid Blyton"
                ],
                "mythology": [
                    "Zeus",
                    "Jupiter",
                    "Apollo",
                    "Ceres",
                    "Chaos",
                    "Nyx",
                    "Gaia",
                    "Erebos",
                    "Hermes",
                    "Aphrodite",
                    "Kerberos",
                    "Eldorado",
                    "Erasmus",
                    "Kanaloa",
                    "Setibos",
                    "Sukkubus",
                    "Ahas",
                    "Philippus",
                    "Uriel",
                    "Onesimus"
                ],
                "actor": [
                    "Edward Norton",
                    "Alan Rickman",
                    "Bud Spencer",
                    "Robert De Niro",
                    "Kevin Spacey",
                    "Johnny Depp",
                    "Mads Mikkelsen",
                    "Christian Bale",
                    "Clint Eastwood",
                    "Jack Nicholson",
                    "Charlie Chaplin",
                    "Harrison Ford",
                    "Morgan Freeman",
                    "Robin Williams",
                    "Tom Hanks",
                    "Denzel Washington",
                    "Bruce Willis",
                    "Ewan McGregor",
                    "Brad Pitt",
                    "Patrick Steward"
                ],
                "politics": [
                    "Barack Obama",
                    "Angela Merkel",
                    "Kofi Annan",
                    "Fidel Castro",
                    "Michail Gorbatschow",
                    "Elizabeth II.",
                    "Benjamin Franklin",
                    "Napoleon Bonaparte",
                    "Mahatma Gandhi",
                    "Lenin",
                    "Jeanne d'Arc",
                    "Vlad III. Drăculea",
                    "Dschingis Khan",
                    "Hernán Cortés",
                    "Wladimir Putin",
                    "John F. Kennedy",
                    "Charles de Gaulle",
                    "Willy Brandt",
                    "Erich Honecker",
                    "Ban Ki-moon"
                ],
                "turing_award": [
                    "Martin E. Hellman",
                    "Whitfield Diffie",
                    "Michael Stonebraker",
                    "Leslie Lamport",
                    "Shafi Goldwasser",
                    "Silvio Micali",
                    "Judea Pearl",
                    "Leslie Valiant",
                    "Charles P. Thacker",
                    "Barbara Liskov",
                    "Joseph Sifakis",
                    "E. Allen Emerson",
                    "Edmund M. Clarke",
                    "Frances E. Allen",
                    "Peter Naur",
                    "Robert E. Kahn",
                    "Vinton G. Cerf",
                    "Alan C. Kay",
                    "Leonard Adleman",
                    "Adi Shamir",
                    "Ronald L. Rivest",
                    "Kristen Nygaard",
                    "Ole-Johan Dahl",
                    "Andrew Yao",
                    "Frederick P. Brooks",
                    "Jim Gray",
                    "Douglas C. Engelbart",
                    "Amir Pnueli",
                    "Manuel Blum",
                    "Raj Reddy",
                    "Edward Feigenbaum",
                    "Richard E. Stearns",
                    "Juris Hartmanis",
                    "Butler Lampson",
                    "Robin Milner",
                    "Fernando José Corbató",
                    "William Kahan",
                    "Ivan Sutherland",
                    "John Cocke",
                    "John E. Hopcroft",
                    "Richard M. Karp",
                    "Niklaus Wirth",
                    "Dennis Ritchie",
                    "Ken Thompson",
                    "Stephen A. Cook",
                    "Edgar F. Codd",
                    "Tony Hoare",
                    "Kenneth E. Iverson",
                    "Robert Floyd",
                    "John W. Backus",
                    "Dana Scott",
                    "Michael O. Rabin",
                    "Herbert A. Simon",
                    "Allen Newell",
                    "Donald E. Knuth",
                    "Charles Bachman",
                    "Edsger W. Dijkstra",
                    "John McCarthy",
                    "James H. Wilkinson",
                    "Marvin Minsky",
                    "Richard Hamming",
                    "Maurice V. Wilkes",
                    "Alan J. Perlis"
                ]
            }
        );
    }

    /**
     * Take each handler, and attach to one of the Express.Router's
     * endpoints.
     */
    init() {
        this.router.get('/', this.getAll);
        this.router.get('/availableNicks/all', this.getAllAvailableNicks);
    }

}

// Create the HeroRouter, and export its configured Express.Router
const apiRoutes = new ApiRouter();
apiRoutes.init();

export default apiRoutes.router;