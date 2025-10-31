import mongoose from "mongoose";

const mgnregaSchema = new mongoose.Schema({}, { strict: false });

export default mongoose.model("Mgnrega", mgnregaSchema);
