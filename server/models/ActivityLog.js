const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema(
	{
		// who performed the action (optional for now, using role from client)
		actorRole: { type: String, enum: ['admin', 'manager', 'editor', 'viewer', 'system'], default: 'system' },
		action: { type: String, required: true, trim: true },
		meta: { type: Object, default: {} },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);







