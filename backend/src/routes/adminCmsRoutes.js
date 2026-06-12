import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AboutModel, BlogModel, ContactModel, TermsModel, FaqModel } from '../models/CmsSettings.js';

const router = express.Router();

// --- ⚙️ MULTER FILE BINARY PARSER CONFIGURATION SYSTEM ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/advisors/';
    // Automatically instantiate the workspace storage paths directory folder if missing
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // 👑 CLEANED: Uses a simpler naming string so it's easier for your server routing to locate
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'media-' + uniqueSuffix + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });

// ==========================================
// 1. ABOUT PAGE CONTROLLERS (Fetch & Save)
// ==========================================
router.get('/about', async (req, res) => {
  try {
    let data = await AboutModel.findOne();
    if (!data) data = await AboutModel.create({}); 
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👑 FIXED: Now safely processes your single top-banner text and photo package
router.post('/about/hero', upload.single('aboutHeroImage'), async (req, res) => {
  try {
    const { heading, subheading, paragraph, currentHeroImage } = req.body;
    let finalHeroImagePath = currentHeroImage || "";
    
    if (req.file) {
      finalHeroImagePath = `/uploads/advisors/${req.file.filename}`;
    }

    const updated = await AboutModel.findOneAndUpdate(
      {}, 
      { heading, subheading, paragraph, heroImage: finalHeroImagePath }, 
      { new: true, upsert: true }
    );
    
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Backend Hero Update Error:", err);
    return res.status(500).json({ error: "Failed to update intro hero parameters.", details: err.message });
  }
});

router.post('/about/pillars', async (req, res) => {
  try {
    const { pillars } = req.body;
    const updated = await AboutModel.findOneAndUpdate({}, { pillars }, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👑 FIXED: Catch your advisor council image arrays binaries along with metadata profiles text fields
router.post('/about/council', upload.array('advisorImages', 12), async (req, res) => {
  try {
    const advisorsData = JSON.parse(req.body.advisorsData || '[]');
    const imageIndices = [].concat(req.body.imageIndices || []); 
    
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        const targetAdvisorIndex = parseInt(imageIndices[index]);
        if (advisorsData[targetAdvisorIndex]) {
          advisorsData[targetAdvisorIndex].image = `/uploads/advisors/${file.filename}`;
        }
      });
    }

    const updated = await AboutModel.findOneAndUpdate(
      {}, 
      { advisors: advisorsData }, 
      { new: true, upsert: true }
    );
    
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Backend Council Update Error:", err);
    return res.status(500).json({ error: "Failed to update council array records.", details: err.message });
  }
});

// ==========================================
// 2. BLOG JOURNAL CONTROLLERS (Fetch & Save)
// ==========================================
router.get('/blog', async (req, res) => {
  try {
    let data = await BlogModel.findOne();
    if (!data) data = await BlogModel.create({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/blog/meta', async (req, res) => {
  try {
    const { journalTitle, journalSub } = req.body;
    const updated = await BlogModel.findOneAndUpdate({}, { journalTitle, journalSub }, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/blog/posts/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const postData = req.body;
    
    let doc = await BlogModel.findOne();
    if (!doc) doc = new BlogModel();
    
    doc.posts = doc.posts.filter(p => p.id !== postId);
    doc.posts.push({ id: postId, ...postData });
    await doc.save();
    
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/blog/posts/:id', async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const doc = await BlogModel.findOne();
    if (doc) {
      doc.posts = doc.posts.filter(p => p.id !== postId);
      await doc.save();
    }
    res.json({ message: "Post removed from database cluster array index" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. CONTACT ROUTER CONTROLLERS
// ==========================================
router.get('/contact', async (req, res) => {
  try {
    let data = await ContactModel.findOne();
    if (!data) data = await ContactModel.create({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/contact/details', async (req, res) => {
  try {
    const updated = await ContactModel.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. TERMS & PRIVACY COMPLIANCE CONTROLLERS
// ==========================================
router.get('/terms', async (req, res) => {
  try {
    let data = await TermsModel.findOne();
    if (!data) data = await TermsModel.create({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/terms/meta', async (req, res) => {
  try {
    const { sectionHeading, sectionSub } = req.body;
    const updated = await TermsModel.findOneAndUpdate({}, { sectionHeading, sectionSub }, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/terms/sidebar', async (req, res) => {
  try {
    const updated = await TermsModel.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/terms/clauses/:id', async (req, res) => {
  try {
    const clauseId = parseInt(req.params.id);
    let doc = await TermsModel.findOne();
    if (!doc) doc = new TermsModel();
    
    doc.protocols = doc.protocols.filter(p => p.id !== clauseId);
    doc.protocols.push({ id: clauseId, ...req.body });
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. FAQ INTERACTIVE ACCORDION CONTROLLERS
// ==========================================
router.get('/faq', async (req, res) => {
  try {
    let data = await FaqModel.findOne();
    if (!data) data = await FaqModel.create({});
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/faq/items/:id', async (req, res) => {
  try {
    const faqId = parseInt(req.params.id);
    let doc = await FaqModel.findOne();
    if (!doc) doc = new FaqModel();
    
    doc.faqItems = doc.faqItems.filter(f => f.id !== faqId);
    doc.faqItems.push({ id: faqId, ...req.body });
    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
