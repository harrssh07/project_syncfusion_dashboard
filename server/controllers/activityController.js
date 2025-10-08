const ActivityLog = require('../models/ActivityLog');

async function listActivities(req, res) {
	const { q, limit = 200 } = req.query;
	const filter = q ? { action: { $regex: q, $options: 'i' } } : {};
	const logs = await ActivityLog.find(filter).sort({ createdAt: -1 }).limit(Number(limit)).lean();
	return res.json(logs);
}

async function createActivity(req, res) {
	const { actorRole = 'system', action, meta = {} } = req.body;
	if (!action) return res.status(400).json({ message: 'action required' });
	const created = await ActivityLog.create({ actorRole, action, meta });
	return res.status(201).json(created);
}

module.exports = { listActivities, createActivity };



