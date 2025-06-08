// routes/eventplaceRoutes.ts or .js

import express from 'express';
import Eventplace from '../module/Eventplace.js';

const router = express.Router();

// Create a new event place
router.post('/', async (req, res) => {
  try {
    const newPlace = new Eventplace(req.body);
    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create event place', details: err });
  }
});

// Get all event places
router.get('/', async (req, res) => {
  try {
    const places = await Eventplace.find().sort({ createdAt: -1 });
    res.status(200).json(places);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event places', details: err });
  }
});

// Get a single event place by ID
router.get('/:id', async (req, res) => {
  try {
    const place = await Eventplace.findById(req.params.id);
    if (!place) return res.status(404).json({ error: 'Event place not found' });
    res.status(200).json(place);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get event place', details: err });
  }
});

// Update event place by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Eventplace.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: 'Event place not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update event place', details: err });
  }
});

// Delete event place by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Eventplace.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Event place not found' });
    res.status(200).json({ message: 'Event place deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event place', details: err });
  }
});

export default router;
