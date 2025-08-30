import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  name: { type: String, required: true },
  bname: { type: String, required: true },
  contact: { type: String, required: true },
  services: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String,
    enum: ["Active", "Completed", "On-hold"],
    default: "Active",
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Half Paid", "Full Paid"],
    default: "Pending",
  },
  totalAmount: { type: Number, default: 0 },
});

export default mongoose.model("Client", clientSchema);
