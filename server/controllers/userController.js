const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

async function listUsers(req, res) {
	const { q } = req.query;
	const filter = q
		? { $or: [
			{ name: { $regex: q, $options: 'i' } },
			{ email: { $regex: q, $options: 'i' } },
			{ role: { $regex: q, $options: 'i' } },
		] }
		: {};
	const users = await User.find(filter).sort({ createdAt: -1 }).lean();
	return res.json(users);
}

async function getUser(req, res) {
	const { id } = req.params;
	const user = await User.findById(id).lean();
	if (!user) return res.status(404).json({ message: 'Not found' });
	return res.json(user);
}

async function createUser(req, res) {
    const { name, email, role = 'viewer', status = 'active' } = req.body;
    try {
        const created = await User.create({ name, email, role, status });
        await ActivityLog.create({ actorRole: 'admin', action: 'users:add', meta: { id: created._id, email: created.email } });
        return res.status(201).json(created);
    } catch (err) {
        // Handle duplicate email nicely
        if (err && err.code === 11000) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        return res.status(400).json({ message: err.message || 'Failed to create user' });
    }
}

async function updateUser(req, res) {
	const { id } = req.params;
	const { name, email, role, status } = req.body;
    const updated = await User.findByIdAndUpdate(
		id,
		{ $set: { name, email, role, status } },
		{ new: true, runValidators: true }
	);
	if (!updated) return res.status(404).json({ message: 'Not found' });
    await ActivityLog.create({ actorRole: 'admin', action: 'users:update', meta: { id } });
	return res.json(updated);
}

async function removeUser(req, res) {
	const { id } = req.params;
    const removed = await User.findByIdAndDelete(id);
	if (!removed) return res.status(404).json({ message: 'Not found' });
    await ActivityLog.create({ actorRole: 'admin', action: 'users:delete', meta: { id } });
    return res.json({ ok: true });
}

module.exports = { listUsers, getUser, createUser, updateUser, removeUser };


