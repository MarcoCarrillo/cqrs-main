import * as express from 'express';
import * as cors from 'cors';
import { createConnection } from 'typeorm';
import * as amqp from 'amqplib/callback_api';
import { Product } from './entity/product';

createConnection().then(db => {
    const productRepository = db.getMongoRepository(Product);
    amqp.connect('amqps://rsbozcyr:XDoJ_MDnkPqvTlJ0WJQdMPTj2FajyVQ-@toad.rmq.cloudamqp.com/rsbozcyr', (error0, connection) => {
        if (error0) {
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            channel.assertQueue('product_created', { durable: false })
            channel.assertQueue('product_updated', { durable: false })
            channel.assertQueue('product_deleted', { durable: false })

            const app = express();

            app.use(cors());
            app.use(express.json());

            channel.consume('product_created', async (msg) => {
                const eventProduct: Product = JSON.parse(msg.content.toString());
                const product = new Product();
                product.admin_id = parseInt(eventProduct.id);
                product.title = eventProduct.title;
                product.image = eventProduct.image;
                product.likes = eventProduct.likes; 

                await productRepository.save(product);
                console.log('product created');
            }, { noAck: true });

            channel.consume('product_updated', async (msg) => {
                const eventProduct: Product = JSON.parse(msg.content.toString());
                const product = await productRepository.findOne({ admin_id: eventProduct.id });
                
                product.admin_id = parseInt(eventProduct.id);
                product.title = eventProduct.title;
                product.image = eventProduct.image;
                product.likes = eventProduct.likes; 

                productRepository.merge(product, {
                    title: eventProduct.title,
                    image: eventProduct.image,
                    likes: eventProduct.likes, 
                });

                await productRepository.save(product);
                console.log('product updated');
            }, { noAck: true });

            channel.consume('product_deleted', async (msg) => {
                const admin_id = parseInt(msg.content.toString());
                
                await productRepository.deleteOne({ admin_id });
                console.log('product deleted');
            });

            app.get('/api/products', async (req: Request, res: Response) => {
                const products = await productRepository.find();
                return res.send(products);
            });

            const PORT = 8001;

            console.log(`Listening to port: ${PORT}`);
            app.listen(PORT);
            process.on('beforeExit', () => {
                console.log('Closing');
                connection.close()
            });
        });
    
    });
    
});

