import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  type: { 
    type: String, 
    enum: ['fake_job', 'spam', 'complaint'], 
    required: true 
  },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'resolved'], 
    default: 'pending' 
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', ReportSchema);
export default Report;
