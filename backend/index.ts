import express, { NextFunction, Request, Response, Router } from 'express';
import cors from 'cors';
import { readFile } from 'fs/promises';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
});

const FetchFile = async (filePath: string): Promise<string> => {
    const fullPath = path.join(__dirname, 'configs', filePath + '.json');
    return await readFile(fullPath, 'utf-8');
};

const router = Router();

router.get("/api/:path", async (req: Request, res: Response, next: NextFunction) => {
    const { path } = req.params;
    try {
        const file = await FetchFile(path);
        res.setHeader('Content-Type', 'application/json');
        res.send(file);
    }
    catch (e) { next(e); }
});

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message);
    res.status(500).send({ error: 'File not found or server error' });
});