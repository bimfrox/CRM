import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
  date: {
    type: String, // storing YYYY-MM-DD as string
    required: true,
  },
  status: {
    type: String,
    enum: ["new", "processing", "completed"],
    default: "new",
  },
});

export default mongoose.model("Task", TaskSchema);
