import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const JobSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String, required: true }],
  salary: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: "USD" }
  },
  experience: { type: Number, required: true, default: 0 }, // in years
  location: { type: String, required: true, trim: true },
  employmentType: { 
    type: String, 
    enum: ['full-time', 'part-time', 'internship', 'contract', 'fresher'], 
    required: true 
  },
  jobCategory: { type: String, required: true },
  openings: { type: Number, default: 1 },
  deadline: { type: Date, required: true },
  remoteType: { 
    type: String, 
    enum: ['remote', 'hybrid', 'onsite'], 
    required: true 
  },
  benefits: [{ type: String }],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'closed'], 
    default: 'pending' 
  },
  rejectionReason: { type: String, default: "" },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', JobSchema);
export default Job;
