import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ApplicationSchema = new Schema({
  candidate: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  resume: { type: String, required: true }, // Static file path on server
  coverLetter: { type: String, default: "" },
  status: { 
    type: String, 
    enum: ['applied', 'viewed', 'shortlisted', 'interview', 'rejected', 'hired'], 
    default: 'applied' 
  },
  interviewDate: { type: Date },
  interviewDetails: { type: String, default: "" }
}, {
  timestamps: true
});

const Application = mongoose.model('Application', ApplicationSchema);
export default Application;
