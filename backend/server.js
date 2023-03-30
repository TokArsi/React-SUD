import express, {response} from "express"
import * as path from "path"
import cors from 'cors'
import mongoose from "mongoose";
import BoardTitles from './models/board-titles-schema.js'
import BoardData from './models/board-data-schema.js'
import multer from "multer"
import * as bodyParser from "express";
import os from 'os';
const corsOptions ={
    origin:'*',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
}

const __dirname = path.resolve();
const PORT = process.env.PORT ?? 3002;
const app = express();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname);
    }
});
const upload = multer({storage: storage});
const db = 'mongodb+srv://TokArsi:74527rrR@cluster0.ff3ri6o.mongodb.net/base1?retryWrites=true&w=majority';
mongoose.set('strictQuery', false);


mongoose
    .connect(db, )
    .then ((res) => console.log('Connected to DB'))
    .catch((error) => console.log(error))


// запуск приложения
app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`);
});
app.use('/images', express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb', extended: false}));
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(cors());
app.get('/board-titles', (req, res) => {
    BoardTitles.find()
            .then((result) => result.map(({title, vector}) =>{
                return {title, vector}
            }))
            .then((result) => res.json(result))
            .catch((er) => console.log(er))
})
app.get('/board-data', (req, res) => {
    BoardData.find()
        .then((result) => result.map(({_id, img_link, company, position, duration, job_id, status}) => {
            return {_id, img_link, company, position, duration, job_id, status}
        }))
        .then((result) => res.json(result))
        .catch((error) => console.log(error))
});
app.post('/images', upload.single('img_link'), (req, res) => {
    res.json(`http://localhost:3002/images/${req.file.filename}`);
})
app.post('/post-request', (req, res) => {
    console.log(JSON.parse(JSON.stringify(req.body)));
    const boardData = new BoardData(req.body)
    boardData.save()
        .then((result) => {
            res.json(result)
            console.log('Saved successfully')
        })
        .catch((error) => console.log(error))
})
app.delete('/request-delete', (req, res) => {
    console.log(req.body);
    const ids = Object.values(req.body);
    console.log(ids);
    BoardData.deleteMany({_id: {$in: ids}}, (err) => {
        if (err) {
            res.status(500).send('Error deleting item');
        } else
            res.status(200).send('Item has been deleted');
    });
    }
)
app.delete('/request-delete-logo', (req, res) => {
    console.log(req.body);
})
app.put('/request-update', (req, res) => {
    console.log(req.body)
    const attributes = {};
    for (let i in req.body)
    {
        if (i !== '_id')
        {
            Object.defineProperty(attributes, i, {value: req.body[i], writable: true, enumerable: true});
        }
    }
    console.log(attributes)
    const newValues = {
        $set: attributes
    }
    console.log(newValues)
    BoardData.updateOne({'_id': req.body._id}, newValues, (error, result)=>{
        console.log("Document updated");
    })
    res.json(req.body);
})


