import mongoose from "mongoose";

const Schema = mongoose.Schema;
const BoardDataScheme = new Schema({
    Logo: {
        type: String,
        required: true
    },
    Company: {
        type: String,
        required: true
    },
    Position: {
        type: String,
        required: true
    },
    Duration: {
        type: String,
        required: true
    },
    Job_ID: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true
    },
})
const BoardData= mongoose.model('BoardData', BoardDataScheme);
export default BoardData