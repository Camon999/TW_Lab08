import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';

let testArr = [4, 5, 6, 3, 5, 3, 7, 5, 13, 5, 6, 4, 3, 6, 3, 6];

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.post(`${this.path}/:id`, this.addData);
        this.router.get(`${this.path}/:id`, this.getEntryById);
        this.router.get(`${this.path}/:id/latest`, this.getLatestEntryById);
        this.router.get(`${this.path}/:id/:num`, this.getEntriesByRange);
        this.router.delete(`${this.path}/all`, this.deleteAllEntries);
        this.router.delete(`${this.path}/:id`, this.deleteEntryById);

    }

    private getLatestReadingsFromAllDevices = async (request: Request, response: Response, next: NextFunction) => {
        response.status(200).json(testArr);
    };

    private getEntryById = async (request: Request, response: Response) => {
        const { id } = request.params;
        const entry = testArr[parseInt(id)];

        if (entry === undefined) {
            return response.status(404).json({ error: "Nie znaleziono wpisu o podanym ID" });
        }

        response.status(200).json({ id, value: entry });
    };

    private getLatestEntryById = async (request: Request, response: Response) => {
        const { id } = request.params;
        const filteredEntries = testArr.filter((_, index) => index.toString() === id);

        if (filteredEntries.length === 0) {
            return response.status(404).json({ error: "Nie znaleziono wpisu o podanym ID" });
        }

        const latestEntry = Math.max(...filteredEntries);
        response.status(200).json({ id, latestValue: latestEntry });
    };

    private getEntriesByRange = async (request: Request, response: Response) => {
        const { id, num } = request.params;
        const startIndex = parseInt(id);
        const count = parseInt(num);

        if (isNaN(startIndex) || isNaN(count) || startIndex < 0 || count <= 0) {
            return response.status(400).json({ error: "Nieprawidłowe wartości parametrów" });
        }

        const entries = testArr.slice(startIndex, startIndex + count);
        response.status(200).json({ id, requestedEntries: entries });
    };

    private deleteAllEntries = async (request: Request, response: Response) => {
        testArr = [];
        response.status(200).json({ message: "Wszystkie dane zostały usunięte" });
    };

    private deleteEntryById = async (request: Request, response: Response) => {
        const { id } = request.params;
        const index = parseInt(id);

        if (index < 0 || index >= testArr.length) {
            return response.status(404).json({ error: "Nie znaleziono wpisu o podanym ID" });
        }

        testArr.splice(index, 1);
        response.status(200).json({ message: "Usunięto wpis", updatedArray: testArr });
    };


    private addData = async (request: Request, response: Response, next: NextFunction) => {
        console.log("Body:", request.body); // 🔥 Dodaj to, aby zobaczyć, co faktycznie jest wysyłane
        const { elem } = request.body;

        if (!elem) {
            return response.status(400).json({ error: "Brak wartości elem w body" });
        }

        testArr.push(elem);
        response.status(201).json({ message: 'Dodano nowe dane', updatedArray: testArr });
    };


}

export default DataController;