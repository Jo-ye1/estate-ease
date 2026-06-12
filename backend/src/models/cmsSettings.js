import mongoose from 'mongoose';

// Schema for About Page Sections
// Open backend/src/models/CmsSettings.js and make sure the AboutSchema looks exactly like this:
const AboutSchema = new mongoose.Schema({
  heading: { type: String, default: "About the Estate Ease Engine" },
  subheading: { type: String, default: "" },
  paragraph: { type: String, default: "" },
  heroImage: { type: String, default: "" }, // 👑 Ensure this exact key matches lowercase heroImage!
  pillars: [{ title: String, text: String }],
  advisors: [{ name: String, role: String, tag: String, linkedin: String, image: String }]
}, { timestamps: true });


// Schema for Blog Journal Page 
const BlogSchema = new mongoose.Schema({
  journalTitle: { type: String, default: "The Estate Ease Journal" },
  journalSub: { type: String, default: "" },
  posts: [{
    id: { type: Number, required: true },
    title: String,
    category: String,
    date: String,
    readTime: String,
    excerpt: String
  }]
}, { timestamps: true });

// Schema for Public Contact Hotlines & Info Widgets
const ContactSchema = new mongoose.Schema({
  phone: String,
  hours: String,
  email: String,
  emailSub: String,
  address: String,
  suite: String
}, { timestamps: true });

// Schema for Terms & Privacy Compliance Layouts
const TermsSchema = new mongoose.Schema({
  sectionHeading: String,
  sectionSub: String,
  legalIntegrityTitle: String,
  integrityPoint1: String,
  integrityPoint2: String,
  protocols: [{ id: Number, numLabel: String, title: String, content: String }]
}, { timestamps: true });

// Schema for FAQ Accordions
const FaqSchema = new mongoose.Schema({
  faqTitle: String,
  faqSub: String,
  faqItems: [{ id: Number, q: String, a: String }]
}, { timestamps: true });

// 👑 Modern ES Module Named Exports
export const AboutModel = mongoose.model('AboutSettings', AboutSchema);
export const BlogModel = mongoose.model('BlogSettings', BlogSchema);
export const ContactModel = mongoose.model('ContactSettings', ContactSchema);
export const TermsModel = mongoose.model('TermsSettings', TermsSchema);
export const FaqModel = mongoose.model('FaqSettings', FaqSchema);
