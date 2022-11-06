import express, { Application, Request, Response } from 'express';
import figlet from 'figlet';
import chalk from 'chalk';

class App {
    public app: Application;

    public port: Number;

    constructor(options: { port: Number, middleWares: Array<any>, controllers: Array<any> }) {
        this.app = express();
        this.port = options.port;

        this.app.set('trust proxy', true);
        this.app.set('strict routing', true);

        this.health();

        this.middlewares(options.middleWares);
        this.routes(options.controllers);

        this.assets();
        this.template();
    }

    private middlewares(middleWares: Array<any>) {
        this.app.use(express.json());
        middleWares.forEach((middleWare) => {
            this.app.use(middleWare);
        });
    }

    private routes(controllers: Array<any>) {
        controllers.forEach((controller) => {
            this.app.use('/v1', controller.router);
        });
    }

    private health() {
        this.app.get('/v1/health', (req: Request, res: Response) => res.json({ status: 'UP' }));
    }

    private assets() {
        this.app.use(express.static('public'));
        this.app.use(express.static('views'));
    }

    private template() {
        this.app.set('view engine', 'ejs');
    }

    public listen() {
        this.app.listen(this.port, async () => {
            figlet('Express', (err, data) => {
                console.log(chalk.greenBright(data));
                console.log(chalk.blueBright(`App listening on http://localhost:${this.port}`));
            });
        });
    }
}

export default App;
