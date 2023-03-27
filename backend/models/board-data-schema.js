import mongoose from "mongoose";

const Schema = mongoose.Schema;
const BoardDataScheme = new Schema({
    img_link: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    job_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
})
const BoardData= mongoose.model('BoardData', BoardDataScheme);
export default BoardData