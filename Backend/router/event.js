import express from 'express';
import Event from '../module/event.js';
import Eventplace from '../module/Eventplace.js';
import dayjs from 'dayjs';
; 
const router = express.Router();


// GET event place info for creating event
router.get('/create/:eventPlaceId', async (req, res) => {
  try {
    const { eventPlaceId } = req.params;
    const place = await Eventplace.findById(eventPlaceId);

    if (!place) {
      return res.status(404).json({ message: 'Event Place not found' });
    }

    res.status(200).json(place);
  } catch (err) {
    console.error('Error fetching EventPlace by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET all events for a couple
router.get('/:coupleId', async (req, res) => {
  const { coupleId } = req.params;
const events = await Event.find()
  .populate('placeId') // assuming 'placeId' is the reference to EventPlace in your Event model
  .exec();
  res.json(events);
});

// POST create event
router.post('/', async (req, res) => {
  console.log('Incoming event data:', req.body);

  try {
    const newEvent = new Event({
      name: req.body.title, // map 'title' to 'name'
      eventType: req.body.type, // map 'type' to 'eventType'
      date: req.body.date,
      placeId: req.body.placeId,
      coupleId: req.body.coupleId,
      description: req.body.description,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.warn('Error creating event:', error);
    res.status(400).json({ error: error.message });
  }
});


router.get('/repeatable', async (req, res) => {
  try {
    const repeatEvents = await Event.find({ repeat: true }).populate('placeId coupleId');

    const today = dayjs();

    const upcoming = repeatEvents
      .map((event) => {
        const eventDate = dayjs(event.date);
        const adjustedDate = eventDate.year(today.year());

        const finalDate = adjustedDate.isBefore(today, 'day')
          ? adjustedDate.add(1, 'year')
          : adjustedDate;

        return {
          ...event.toObject(),
          nextOccurrence: finalDate.toDate(),
          countdown: finalDate.diff(today, 'day'),
        };
      })
      .sort((a, b) => a.countdown - b.countdown);

    res.status(200).json(upcoming);
  } catch (err) {
    console.error('Error getting repeatable events:', err);
    res.status(500).json({ error: 'Failed to load repeatable events' });
  }
});
// DELETE event
router.delete('/:eventId', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: 'Failed to delete' });
  }
});

// PUT update event
router.put('/:eventId', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Failed to update' });
  }
});

export default router;
