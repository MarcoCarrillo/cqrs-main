import * as express from 'express';
import * as cors from 'cors';
import { createConnection } from 'typeorm';
import * as amqp from 'amqplib/callback_api';

createConnection().then(db => {

    amqp.connect('amqps://rsbozcyr:XDoJ_MDnkPqvTlJ0WJQdMPTj2FajyVQ-@toad.rmq.cloudamqp.com/rsbozcyr', (error0, connection) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            const app = express();

            app.use(cors());
            app.use(express.json());

            const PORT = 8001;

            console.log(`Listening to port: ${PORT}`);
            app.listen(PORT);
        });
    
    });
    
});

