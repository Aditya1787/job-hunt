import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true, trim: true },
  logo: { type: String, default: "" },
  website: { type: String, default: "" },
  description: { type: String, default: "" },
  companySize: { type: String, default: "" },
  industry: { type: String, default: "" },
  headquarters: { type: String, default: "" },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'suspended'], 
    default: 'pending' 
  },
  socialLinks: {
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" }
  }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', CompanySchema);
export default Company;
