const express = require('express');
const { listActivities, createActivity } = require('../controllers/activityController');

const router = express.Router();

router.get('/', listActivities);
router.post('/', createActivity);

module.exports = router;







