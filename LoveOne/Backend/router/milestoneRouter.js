import express from 'express';
import authenticate from '../middleware/authenticate.js';
import partner from '../module/partner.js';

const router = express.Router();

// ✅ GET all milestones
router.get('/:coupleId/milestones', authenticate, async (req, res) => {
  try {
    const { coupleId } = req.params;
    const profile = await partner.findById(coupleId);

    if (!profile) {
      return res.status(404).json({ message: 'Couple profile not found' });
    }

    res.status(200).json(profile.milestones); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ ADD a milestone
router.post('/:coupleId/milestones', authenticate, async (req, res) => {
  try {
    const { coupleId } = req.params;
    const { title, description, date, image } = req.body;

    const profile = await partner.findById(coupleId);
    if (!profile) {
      return res.status(404).json({ message: 'Couple profile not found' });
    }

    const newMilestone = { title, description, date, image };
    profile.milestones.push(newMilestone);
    await profile.save();

    res.status(201).json({
      message: 'Milestone added successfully',
      milestone: profile.milestones.at(-1), // Return the newly added one
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ UPDATE a milestone
router.put('/:coupleId/milestones/:milestoneId', authenticate, async (req, res) => {
  try {
    const { coupleId, milestoneId } = req.params;
    const updates = req.body;

    const profile = await partner.findById(coupleId);
    if (!profile) {
      return res.status(404).json({ message: 'Couple profile not found' });
    }

    const milestone = profile.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    Object.assign(milestone, updates);
    await profile.save();

    res.status(200).json({
      message: 'Milestone updated successfully',
      milestone,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ DELETE a milestone
router.delete('/:coupleId/milestones/:milestoneId', authenticate, async (req, res) => {
  try {
    const { coupleId, milestoneId } = req.params;

    const profile = await partner.findById(coupleId);
    if (!profile) {
      return res.status(404).json({ message: 'Couple profile not found' });
    }

    const milestone = profile.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    profile.milestones.pull({ _id: milestoneId });
    await profile.save();

    res.status(200).json({ message: 'Milestone deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


export default router;
