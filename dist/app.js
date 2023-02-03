import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ServerApiVersion } from'mongodb';

require('dotenv').config({ path: __dirname + '/.env' });

const { MONGO_PATH, } = process.env;

class App {
    constructor(controllers) {
        this.app = express();
        this.connectToDb();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    initializeMiddlewares() {
        this.app.use(bodyParser.json());
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    listen() {
        this.app.listen(process.env.PORT, () => {
            console.log(`App listening on ${process.env.PORT}`);
        });
    }
    connectToDb() {
        console.log(`DB on  ${MONGO_PATH}`);
        const client = new MongoClient(MONGO_PATH, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        client.connect(err => {
            console.log(`connected on DB`);
            const collection = client.db("test").collection("devices");
            // perform actions on the collection object
            client.close();
        });
    }
}
export default App;
//# sourceMappingURL=app.js.map