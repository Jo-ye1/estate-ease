import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "negotiating",
        "won",
        "lost",
        "archived"
      ],
      default: "new"
    },


    contactedAt: {
      type: Date,
      default: null,
    },

    qualifiedAt: {
      type: Date,
      default: null,
    },

    negotiatingAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },

    lastInteractionAt: {
      type: Date,
      default: Date.now
    },

    lossReason: {
      type: String,
      default: "",
    },

    pipelineStage: {
      type: String,
      enum: [
        "new",
        "contacted",
        "viewing",
        "negotiation",
        "offer",
        "contract",
        "closed",
        "lost"
      ],
      default: "new"
    },

    stageHistory: [
      {
        stage: {
          type: String,
          enum: [
            "new",
            "contacted",
            "viewing",
            "negotiation",
            "offer",
            "contract",
            "closed",
            "lost"
          ]
        },
        movedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        movedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    lastStageUpdatedAt: {
      type: Date,
      default: Date.now
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium"
    },

    assignedAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    assignedAt: {
      type: Date,
      default: null
    },

    phone: String,

budget: {
  type: Number,
  default: 0
},

leadScore: {
  type: Number,
  default: 0
},

tags: [{
  type: String
}],

nextFollowUp: {
  type: Date,
  default: null
  },
  
source: {
  type: String,
  enum: [
    "property_contact_form",
    "website",
    "referral",
    "social_media",
    "manual"
  ],
  default: "property_contact_form"
}

  },
  { timestamps: true }
);

leadSchema.index({ owner: 1 });
leadSchema.index({ buyer: 1 });
leadSchema.index({ property: 1 });
leadSchema.index({ pipelineStage: 1 });
leadSchema.index({ assignedAgent: 1 });
leadSchema.index({ owner: 1, pipelineStage: 1 });

export default mongoose.model("Lead", leadSchema);
