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
    if (!data) data = await AboutModel.create({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      historyTimeline,
      advisors,
    } = req.body;

    const updated = await AboutModel.findOneAndUpdate(
      {},
      {
        heading,
        subheading,
        paragraph,
        heroImage,
        pillars,
        historyTimeline: historyTimeline || [],
        advisors,
      },
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

router.post(
  "/about/hero",
  upload.single("aboutHeroImage"),
  async (req, res) => {
    try {
      const {
        heading,
        subheading,
        paragraph,
        currentHeroImage,
      } = req.body;

      let heroPath = currentHeroImage || "";

      if (req.file) {
        heroPath = `/uploads/advisors/${req.file.filename}`;
      }

      const updated = await AboutModel.findOneAndUpdate(
        {},
        {
          heading,
          subheading,
          paragraph,
          heroImage: heroPath,
        },
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
  }
);

router.post("/about/pillars", async (req, res) => {
  try {
    const { pillars } = req.body;

    const updated = await AboutModel.findOneAndUpdate(
      {},
      { pillars },
      {
        new: true,
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
      const advisorsData = JSON.parse(
        req.body.advisorsData || "[]"
      );

      const imageIndices = [].concat(
        req.body.imageIndices || []
      );

      if (req.files?.length > 0) {
        req.files.forEach((file, index) => {
          const targetIndex = parseInt(
            imageIndices[index]
          );

          if (advisorsData[targetIndex]) {
            advisorsData[targetIndex].image =
              `/uploads/advisors/${file.filename}`;
          }
        });
      }

      const updated = await AboutModel.findOneAndUpdate(
        {},
        { advisors: advisorsData },
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

router.post("/blog/meta", async (req, res) => {
  try {
    const { journalTitle, journalSub } = req.body;

    const updated = await BlogModel.findOneAndUpdate(
      {},
      {
        journalTitle,
        journalSub,
      },
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

router.put("/blog/posts/:id", async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const postData = req.body;

    let doc = await BlogModel.findOne();
    if (!doc) doc = new BlogModel();

    doc.posts = doc.posts.filter(
      (post) => post.id !== postId
    );

    doc.posts.push({
      id: postId,
      ...postData,
    });

    await doc.save();

    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/blog/posts/:id", async (req, res) => {
  try {
    const postId = Number(req.params.id);

    const doc = await BlogModel.findOne();

    if (doc) {
      doc.posts = doc.posts.filter(
        (post) => post.id !== postId
      );
      await doc.save();
    }

    res.json({
      message: "Post removed successfully",
    });
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

router.get("/terms", async (req, res) => {
  try {
    let data = await TermsModel.findOne();
    if (!data) data = await TermsModel.create({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/terms/meta", async (req, res) => {
  try {
    const { sectionHeading, sectionSub } = req.body;

    const updated = await TermsModel.findOneAndUpdate(
      {},
      {
        sectionHeading,
        sectionSub,
      },
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

router.post("/terms/sidebar", async (req, res) => {
  try {
    const updated = await TermsModel.findOneAndUpdate(
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

router.put("/terms/clauses/:id", async (req, res) => {
  try {
    const clauseId = Number(req.params.id);

    let doc = await TermsModel.findOne();
    if (!doc) doc = new TermsModel();

    doc.protocols = doc.protocols.filter(
      (item) => item.id !== clauseId
    );

    doc.protocols.push({
      id: clauseId,
      ...req.body,
    });

    await doc.save();

    res.json(doc);
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