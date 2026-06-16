import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  type: { 
    type: String, 
    enum: ['application_status', 'new_job', 'interview', 'job_approval', 'message'], 
    required: true 
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String, default: "" }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
