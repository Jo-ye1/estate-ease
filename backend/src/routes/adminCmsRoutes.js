import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  AboutModel,
  BlogModel,
  ContactModel,
  TermsModel,
  FaqModel,
  HomeCmsModel,
} from "../models/CmsSettings.js";
import Workflow from "../models/WorkflowModel.js";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/advisors/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      "media-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.get("/about", async (req, res) => {
  try {
    let data = await AboutModel.findOne();

    if (!data) {
      data = await AboutModel.create({
        heading: "",
        subheading: "",
        paragraph: "",
        heroImage: "",
        pillars: [],
        history: [],
        advisors: [],
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.put("/about", async (req, res) => {
  try {
    const {
      heading,
      subheading,
      paragraph,
      heroImage,
      pillars,
      history,
      advisors,
    } = req.body;

    const cleanHistoryPayload = Array.isArray(history)
      ? history.map((item) => ({
          year: String(item.year || "2026"),
          title: String(item.title || ""),
          body: String(item.body || ""),
        }))
      : [];

    let existing = await AboutModel.findOne();

    if (!existing) {
      existing = await AboutModel.create({
        heading: "",
        subheading: "",
        paragraph: "",
        heroImage: "",
        pillars: [],
        history: [],
        advisors: [],
      });
    }

    existing.heading = heading || "";
    existing.subheading = subheading || "";
    existing.paragraph = paragraph || "";
    existing.heroImage = heroImage || "";
    existing.pillars = Array.isArray(pillars) ? pillars : [];
    existing.advisors = Array.isArray(advisors) ? advisors : [];
    existing.history = cleanHistoryPayload;

    await existing.save();

    return res.status(200).json(existing);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/about/pillars", async (req, res) => {
  try {
    const { pillars } = req.body;

    const updated = await AboutModel.findOneAndUpdate(
      {},
      { 
        $set: { pillars } 
      },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post(
  "/about/council",
  upload.array("advisorImages", 12),
  async (req, res) => {
    try {
      const advisorsData = JSON.parse(req.body.advisorsData || "[]");
      const imageIndices = [].concat(req.body.imageIndices || []);

      if (req.files?.length > 0) {
        req.files.forEach((file, index) => {
          const targetIndex = parseInt(imageIndices[index]);
          if (advisorsData[targetIndex]) {
            advisorsData[targetIndex].image = `/uploads/advisors/${file.filename}`;
          }
        });
      }

      const updated = await AboutModel.findOneAndUpdate(
        {},
        { 
          $set: { advisors: advisorsData } 
        },
        {
          returnDocument: "after",
          upsert: true,
        }
      );

      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);


router.get("/blog", async (req, res) => {
  try {
    let data = await BlogModel.findOne();
    if (!data) data = await BlogModel.create({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/blog", async (req, res) => {
  try {
    const { journalTitle, journalSub, posts } = req.body;
    const sourcePostsArray = Array.isArray(posts) ? posts : [];

    const cleanPostsPayload = sourcePostsArray.map((post, idx) => {
      let numericId = Number(post.id);
      if (isNaN(numericId) || String(post.id).startsWith("temp-")) {
        numericId = Date.now() + idx;
      }
      return {
        id: numericId,
        title: String(post.title || ""),
        category: String(post.category || "MEDIA"),
        date: String(post.date || new Date().toISOString().split('T')[0]),
        readTime: String(post.readTime || "5 MIN READ"),
        excerpt: String(post.excerpt || ""),
        content: String(post.content || ""),
        image: String(post.image || "")
      };
    });

    const updated = await BlogModel.findOneAndUpdate(
      {},
      {
        journalTitle,
        journalSub,
        posts: cleanPostsPayload,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/contact", async (req, res) => {
  try {
    let data = await ContactModel.findOne();
    if (!data) data = await ContactModel.create({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/contact/details", async (req, res) => {
  try {
    const updated = await ContactModel.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        upsert: true,
      }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 NEW TERMS & COMPLIANCE DATABASE SCHEMA ROUTER ENDPOINTS
router.get("/terms", async (req, res) => {
  try {
    let data = await TermsModel.findOne();
    if (!data) data = await TermsModel.create({ protocols: [] });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/terms/meta", async (req, res) => {
  try {
    const updated = await TermsModel.findOneAndUpdate(
      {},
      { heading: req.body.heading, subheading: req.body.subheading },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/terms/protocols", async (req, res) => {
  try {
    const updated = await TermsModel.findOneAndUpdate(
      {},
      { protocols: req.body.protocols },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/terms/integrity", async (req, res) => {
  try {
    const updated = await TermsModel.findOneAndUpdate(
      {},
      {
        integrityTitle: req.body.integrityTitle,
        integrityP1: req.body.integrityP1,
        integrityP2: req.body.integrityP2
      },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/faq", async (req, res) => {
  try {
    let data = await FaqModel.findOne();
    if (!data) data = await FaqModel.create({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/faq/items/:id", async (req, res) => {
  try {
    const faqId = Number(req.params.id);

    let doc = await FaqModel.findOne();
    if (!doc) doc = new FaqModel();

    doc.faqItems = doc.faqItems.filter(
      (item) => item.id !== faqId
    );

    doc.faqItems.push({
      id: faqId,
      ...req.body,
    });

    await doc.save();

    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/home-cms", async (req, res) => {
  try {
    let data = await HomeCmsModel.findOne();

    if (!data) {
      data = await HomeCmsModel.create({
        bullets: [
          "A building with only one room.",
          "A movable residence.",
          "Property financial analysis.",
          "Building inspections.",
          "Raw material housing.",
        ],
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.put("/home-cms", async (req, res) => {
  try {
    const updated = await HomeCmsModel.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;

// 🟢 GET WORKFLOW FRAMEWORK CONTENT
router.get("/workflow", async (req, res) => {
  try {
    let data = await Workflow.findOne();
    if (!data) {
      data = await Workflow.create({
        steps: [
          { id: 1, iconName: "Search", tag: "STEP 01", title: "Explore Listings", desc: "Browse through an elite selection of verified real-estate ecosystems." },
          { id: 2, iconName: "MessageSquare", tag: "STEP 02", title: "Connect Instantly", desc: "Engage with corporate operators and executive advisors directly." },
          { id: 3, iconName: "Key", tag: "STEP 03", title: "Secure Your Asset", desc: "Finalize transactions seamlessly within an optimized layer." }
        ]
      });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 UPDATE HERO & META TEXT STRINGS
router.post("/workflow/meta", async (req, res) => {
  try {
    const updated = await Workflow.findOneAndUpdate(
      {},
      {
        heroBadge: req.body.heroBadge,
        heroTitle: req.body.heroTitle,
        heroDesc: req.body.heroDesc,
        ctaTitle: req.body.ctaTitle,
        ctaDesc: req.body.ctaDesc,
        sectionBadge: req.body.sectionBadge,
        sectionTitle: req.body.sectionTitle
      },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 UPDATE INDIVIDUAL ACCORDION WORKFLOW STEPS
router.put("/workflow/steps/:id", async (req, res) => {
  try {
    const stepId = Number(req.params.id);
    let doc = await Workflow.findOne();
    if (!doc) doc = new Workflow();

    doc.steps = doc.steps.filter((item) => item.id !== stepId);
    doc.steps.push({ id: stepId, ...req.body });
    
    // Sort array chronologically before disk commitment save
    doc.steps.sort((a, b) => a.id - b.id);
    await doc.save();

    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  });