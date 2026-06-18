import mongoose from 'mongoose';

// ==========================================
// 👑 NEW: HOMEPAGE CMS SCHEMA SYSTEM
// ==========================================
const HomeCmsSchema = new mongoose.Schema({
  // About Section parameters
  aboutHeading: { type: String, default: "We Are The Best And Trusted Real Estate Agent" },
  aboutP1: { type: String, default: "Et harum quidem rerum facilis est et expedita distinctio..." },
  aboutP2: { type: String, default: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem..." },
  aboutImage: { type: String, default: "" },
  accordions: [
    { q: { type: String }, a: { type: String } }
  ],
  // Why Choose Us Section parameters
  chooseHeading: { type: String, default: "We Are Offering The Best Real Estate Deals" },
  chooseP1: { type: String, default: "Et harum quidem rerum facilis est et expedita distinctio..." },
  chooseP2: { type: String, default: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem..." },
  chooseImage: { type: String, default: "" },
  statYears: { type: String, default: "12+" },
  statCustomers: { type: String, default: "4,800+" },
  statCapital: { type: String, default: "15M+" },
  bullets: [{ type: String }]
}, { timestamps: true });


const AboutSchema = new mongoose.Schema({
  heading: { type: String, default: "About the Estate Ease Engine" },
  subheading: { type: String, default: "" },
  paragraph: { type: String, default: "" },
  heroImage: { type: String, default: "" },
  pillars: [{ title: String, text: String }],
  history: [
    {
      year: { type: String, default: "" },
      title: { type: String, default: "" },
      body: { type: String, default: "" }
    }
  ],
  advisors: [
    {
      name: String,
      role: String,
      tag: String,
      linkedin: String,
      image: String
    }
  ]
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  journalTitle: { type: String, default: "The Estate Ease Journal" },
  journalSub: { type: String, default: "" },
  posts: [{
    id: { type: Number, required: true },
    title: String,
    category: String,
    date: String,
    readTime: String,
    excerpt: String,
    content: String, // 🟢 Added to store detailed article copy details safely
    image: String    // 🟢 Added to preserve cover thumbnail paths securely
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


// ==========================================
// 👑 Modern ES Module Named Exports
// ==========================================
export const HomeCmsModel = mongoose.model('HomeCmsSetting', HomeCmsSchema); // 👑 Newly Exported Lander Model
export const AboutModel = mongoose.model('AboutSettings', AboutSchema);
export const BlogModel = mongoose.model('BlogSettings', BlogSchema);
export const ContactModel = mongoose.model('ContactSettings', ContactSchema);
export const TermsModel = mongoose.model('TermsSettings', TermsSchema);
export const FaqModel = mongoose.model('FaqSettings', FaqSchema);