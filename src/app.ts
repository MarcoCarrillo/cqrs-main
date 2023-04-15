import * as express from 'express';
import * as cors from 'cors';
import { createConnection } from 'typeorm';
import { Product } from './entity/product';

createConnection().then(db => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    const PORT = 8001;

    console.log(`Listening to port: ${PORT}`);
    app.listen(PORT);
});

