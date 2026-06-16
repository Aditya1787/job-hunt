import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const ExperienceSchema = new Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String, default: "" }
});

const EducationSchema = new Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  current: { type: Boolean, default: false },
  description: { type: String, default: "" }
});

const ProjectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  link: { type: String, default: "" },
  skillsUsed: [{ type: String }]
});

const CertificationSchema = new Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: Date },
  expirationDate: { type: Date }
});

const CandidateProfileSchema = new Schema({
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  bio: { type: String, default: "" },
  skills: [{ type: String }],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  projects: [ProjectSchema],
  certifications: [CertificationSchema],
  resumeUrl: { type: String, default: "" },
  resumeText: { type: String, default: "" },
  socialLinks: {
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" }
  },
  savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }]
});

const CompanyProfileSchema = new Schema({
  companyName: { type: String, default: "" },
  website: { type: String, default: "" },
  description: { type: String, default: "" },
  companySize: { type: String, default: "" },
  industry: { type: String, default: "" },
  headquarters: { type: String, default: "" },
  socialLinks: {
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" }
  }
});

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['candidate', 'company', 'admin'], required: true },
  profilePhoto: { type: String, default: "" },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  candidateProfile: { type: CandidateProfileSchema, default: () => ({}) },
  companyProfile: { type: CompanyProfileSchema, default: () => ({}) }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
