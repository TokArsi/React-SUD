import express from "express"
import * as path from "path"
import cors from 'cors'
import mongoose from "mongoose";
import BoardData from './models/board-data-schema.js'
import multer from "multer"
import * as bodyParser from "express";
import * as fs from "fs";
import {ObjectId} from "bson";

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

app.use('/images', express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb', extended: false}));
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(cors());

mongoose
    .connect(db, )
    .then (() => console.log('Connected to DB'))
    .catch((error) => console.log(error))


// запуск приложения
app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}...`);
});


app.get('/board-data', (req, res) => {
    BoardData.find()
        .then((result) => result.map(({_id, Logo, Company, Position, Duration, Job_ID, Status}) => {
            return {_id, Logo, Company, Position, Duration, Job_ID, Status}
        }))
        .then((result) => res.json(result))
        .catch((error) => console.log(error))
});
app.post('/images', upload.single('Logo'), (req, res) => {
    // const actualExtension = path.extname(req.file.filename).toLowerCase();
    // const newFileName = req.file.filename.replace(/\.jpeg$/i, actualExtension);
    res.json(`http://localhost:3002/images/${req.file.filename}`);
})

app.post('/post-request', (req, res) => {
    console.log(JSON.parse(JSON.stringify(req.body)));
    const boardData = new BoardData(req.body);
    boardData.save()
        .then((result) => {
            res.json(result);
            console.log('Saved successfully');
        })
        .catch((error) => console.log(error));
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
    const deletedFileNames = req.body;
    BoardData.find()
        .then(result => result.map(({Logo}) => {
            return {Logo}.Logo.split('/').pop();
        }))
        .then(result => {
            if(result)
            {
                deletedFileNames.map((fileName) => {
                    if(result.includes(fileName))
                        res.status(200).json('There is no file to delete ...')
                    else {
                        const filePath = __dirname + '/public' + `/${fileName}`;
                        fs.unlink(filePath, (err) => {
                            if(err)
                                console.log(err);
                            console.log(`deleted ${fileName}`)
                            res.status(200).json(`File ${fileName} has been deleted`)
                        })
                    }
                })
            } else res.status(200).json('There is no file to delete ...')
        })
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
    BoardData.updateOne({'_id': req.body._id}, newValues, ()=>{
        console.log("Document updated");
    })
    res.json(req.body);
})
app.post('/form/id', (req, res) => {
    console.log('request: ', req.body);
    const id = req.body;
    BoardData.findOne({_id: new ObjectId(id)})
        .then(data => {
            console.log(data);
            res.json(data);
        })
})





