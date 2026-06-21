import mongoose from 'mongoose';

// 1. LEAD MODEL (The foundation of the Agency & Agent Pipeline)
const LeadSchema = new mongoose.Schema({
  agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true, index: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  propertyId: { type: String, default: null }, // Reference to your existing property collection/ID
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  stage: { 
    type: String, 
    enum: ['NEW', 'ASSIGNED', 'CONTACTED', 'VIEWING_SCHEDULED', 'NEGOTIATION', 'OFFER', 'CONTRACT', 'CLOSED_WON', 'LOST'], 
    default: 'NEW',
    index: true
  },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  leadSource: { type: String, default: 'Web Direct' },
  leadScore: { type: Number, default: 50 }, // 1-100 score
  notes: { type: String, default: '' }
}, { timestamps: true });

// 2. AGENT TASK MODEL (Daily action items for the CRM workspace)
const AgentTaskSchema = new mongoose.Schema({
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', default: null },
  propertyId: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true, index: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  isCompleted: { type: Boolean, default: false, index: true }
}, { timestamps: true });

// 3. DEAL & COMMISSION LEDGER MODEL (Granular financial record)
const DealSchema = new mongoose.Schema({
  agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: true, index: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  propertyId: { type: String, required: true },
  salePrice: { type: Number, required: true },
  platformFee: { type: Number, required: true },
  agencySplit: { type: Number, required: true },
  agentSplit: { type: Number, required: true },
  taxes: { type: Number, required: true },
  netIncome: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'PAID', 'DISPUTED', 'ESCROW'], default: 'ESCROW', index: true },
  closedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 4. ACTIVITY TIMELINE MODEL (The un-editable historical trail)
const AgentActivitySchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', index: true },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  actorId: { type: String, required: true }, // Who completed the action
  title: { type: String, required: true },
  description: { type: String, required: true },
  eventIcon: { type: String, enum: ['phone', 'email', 'calendar', 'file', 'cpu', 'alert', 'wallet'], default: 'phone' }
}, { timestamps: true });

// Safe export pattern for Next.js hot-reloading
export const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
export const AgentTask = mongoose.models.AgentTask || mongoose.model('AgentTask', AgentTaskSchema);
export const Deal = mongoose.models.Deal || mongoose.model('Deal', DealSchema);
export const AgentActivity = mongoose.models.AgentActivity || mongoose.model('AgentActivity', AgentActivitySchema);
