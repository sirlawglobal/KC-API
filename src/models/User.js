const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Personal Details
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  dateOfBirth: { type: Date },
  username: { type: String, required: true, unique: true },

  // Emergency Contact
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true },
  },

  // Team Assignment
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }], // Array of references to Team model

  // Professional Details
  department: { type: String },
  position: { type: String },
  hireDate: { type: Date },
  skills: [String], // Array of strings to store multiple skills
  certifications: [
    {
      title: { type: String },
      issuedBy: { type: String },
      date: { type: Date },
    },
  ],

  // HR Data
  workHours: { type: Number, default: 0 }, // Total work hours logged
  overtimeHours: { type: Number, default: 0 }, // Overtime hours worked by the user
  leaveRecords: [
    {
      leaveType: { type: String, enum: ['sick', 'vacation', 'other'], default: 'other' },
      startDate: { type: Date },
      endDate: { type: Date },
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      days: { type: Number }, // Automatically calculated days based on start and end date
    },
  ],
  performanceReviews: [
    {
      reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to reviewer (can be manager or peer)
      reviewType: { type: String, enum: ['manager', 'peer'], required: true }, // Type of review (manager or peer)
      date: { type: Date },
      feedback: { type: String },
      rating: { type: Number, min: 1, max: 5 }, // Performance rating (1-5)
    },
  ],

  // Authentication
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'employee', 'client'], 
    default: 'employee',
  },
  twoFactorEnabled: { type: Boolean, default: false },
  sessionLogs: [
    {
      sessionId: { type: String },
      loginAt: { type: Date },
      logoutAt: { type: Date },
      ip: { type: String },
      userAgent: { type: String },
    },
  ],

  // Activity Logs
  activityLogs: [
    {
      action: { type: String }, // e.g., 'logged in', 'updated profile'
      timestamp: { type: Date, default: Date.now },
      details: { type: String },
    },
  ],

  // Privacy and GDPR Compliance
  isDeactivated: { type: Boolean, default: false }, // For deactivation without deletion
  privacySettings: {
    canRequestDataDeletion: { type: Boolean, default: true },
    dataUsageDetails: { type: String }, // Description of how data is being used
  },

  // File Attachments
  attachments: [
    {
      type: { type: String, enum: ['resume', 'id_proof', 'certification'], required: true },
      fileUrl: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],

  verificationToken: String,
  tokenExpiration: Date,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Pre-save hook to hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const bcrypt = require('bcrypt');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(enteredPassword, this.password);
};

// userSchema.statics.updateVerificationToken = async function (email, token, expiration) {
//   return this.updateOne(
//     { email },
//     { $set: { verificationToken: token, tokenExpiration: expiration } }
//   );
// };

// Add static method to find user by verification token

// Static method to find a user by verification token
UserSchema.statics.findUserByVerificationToken = function (token) {
  return this.findOne({ verificationToken: token });
};

// Static method to update email verification status
UserSchema.statics.updateEmailVerificationStatus = function (userId) {
  return this.updateOne({ _id: userId }, { $set: { emailVerified: true, verificationToken: null, verification_token_expiry: null } });
};


module.exports = mongoose.model('User', UserSchema);
