const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true },
		role: { type: String, enum: ['admin', 'manager', 'editor', 'viewer'], default: 'viewer' },
		status: { type: String, enum: ['active', 'suspended'], default: 'active' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);


