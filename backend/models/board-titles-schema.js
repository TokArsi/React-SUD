import mongoose from "mongoose";

const Schema = mongoose.Schema;
const BoardTitlesScheme = new Schema({
    title: {
        type: String,
        required: true
    },
    vector: {
        type: String,
        required: true
    }
})
const BoardTitles = mongoose.model('BoardTitles', BoardTitlesScheme);
export default BoardTitles