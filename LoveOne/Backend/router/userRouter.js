import express from "express";
import User from "../module/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Partner from "../module/partner.js";
import authenticate from '../middleware/authenticate.js'; 

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, birthday,gender, email, password } = req.body;
    const userexists= await User.findOne({email});
    if(userexists){
      return res.status(400).json({massage:'Bal ar user '});
    } 
    const salt = await bcrypt.genSalt(10);
    const hashedpassord = await bcrypt.hash(password, salt)
    const user = await User.create({ name, email,birthday,gender, password:hashedpassord });
    res.status(201).json({ massage: "user created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ massage: "server error" });
  }
}); 

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ massage: 'user not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ massage: 'invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultSecretKey');
    res.status(200).json({ massage: 'login successful', user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ massage: 'server error' });
  }
});
router.post('/generate-partner-link', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Generate a unique code (you can also store it in DB)
    const partnerCode = Math.random().toString(36).substring(2, 10);

    // Save to user's profile or a separate PartnerRequest model
    await User.findByIdAndUpdate(userId, { partnerCode });

    res.status(200).json({ code: partnerCode });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
});
router.post('/connect-partner', async (req, res) => {
  try {
    const { partnerCode } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const partnerUser = await User.findOne({ partnerCode });

    if (!partnerUser) {
      return res.status(404).json({ message: 'Invalid code' });
    }

    // ❗ Prevent user from connecting to themselves
    if (partnerUser._id.toString() === userId) {
      return res.status(400).json({ message: 'You cannot connect with yourself' });
    }

    // ✅ Check if already connected
    const existing = await Partner.findOne({
      $or: [
        { userA: userId, userB: partnerUser._id },
        { userA: partnerUser._id, userB: userId },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: 'Already connected' });
    }

    // ✅ Create new partner connection
    const newPart = await Partner.create({
      userA: userId,
      userB: partnerUser._id,
    });

    res.status(200).json({ message: 'Partner connected', part: newPart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/profile-picture', async (req, res) => {
  const { userId, imageUrl } = req.body;

  if (!userId || !imageUrl) {
    return res.status(400).json({ message: 'userId and imageUrl required' });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { img: imageUrl }, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile picture updated', user });
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.delete('/disconnect-partner', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const existing = await Partner.findOne({
      $or: [{ userA: userId }, { userB: userId }],
    });

    if (!existing) {
      return res.status(404).json({ message: 'Not connected' });
    }

    await existing.deleteOne(); // ✅ Correct Mongoose method

    res.status(200).json({ message: 'Partner disconnected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Fetch the current user and their partner
    const partner = await Partner.findOne({
      $or: [{ userA: userId }, { userB: userId }],
    }).populate('userA userB');

    if (!partner) {
      return res.status(404).json({ message: 'No partner found' });
    }

    const partner1 = partner.userA._id.toString() === userId ? partner.userA : partner.userB;
    const partner2 = partner.userA._id.toString() === userId ? partner.userB : partner.userA;

    // Example: store the anniversary and milestones in the Partner model
    res.json({
      partner1,
      partner2,
      anniversary: partner.anniversary || new Date(), // fallback if not stored
      milestones: partner.milestones || [], // fallback if not stored
      coupleId: partner._id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/connections', authenticate, async (req, res) => {
  try {
    const userId = req.user._id?.toString?.() || req.user;

    const couple = await Partner.findOne({
      $or: [{ userA: userId }, { userB: userId }],
    }).populate('userA userB');

    if (!couple) {
      return res.status(404).json({ message: 'No partner found' });
    }

    const partner = couple.userA._id.toString() === userId ? couple.userB : couple.userA;

    return res.json([
      {
        roomId: couple._id.toString(),
        partner: {
          _id: partner._id.toString(),
          name: partner.name,
          avatar_url: partner.img || '',
        },
      },
    ]); 

  } catch (err) {
    console.error('❌ Error fetching partner connection:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router
  