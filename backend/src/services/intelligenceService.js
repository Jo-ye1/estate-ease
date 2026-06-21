import mongoose from "mongoose";

export const calculateConversionRate = async (agencyId) => {
  const Lead = mongoose.model("Lead");

  const total = await Lead.countDocuments({ agencyId });
  const won = await Lead.countDocuments({
    agencyId,
    status: "won"
  });

  return total === 0 ? 0 : (won / total) * 100;
};

export const calculateClosingSpeed = async (agencyId) => {
  const Deal = mongoose.model("Deal");

  const deals = await Deal.find({
    agencyId,
    dealStatus: "closed"
  });

  if (!deals.length) return 0;

  const totalDays = deals.reduce((acc, d) => {
    const diff = (d.closedAt - d.createdAt) / (1000 * 60 * 60 * 24);
    return acc + diff;
  }, 0);

  return totalDays / deals.length;
};

export const calculateLeadSourceQuality = async (agencyId) => {
  const Lead = mongoose.model("Lead");

  const leads = await Lead.aggregate([
    { $match: { agencyId: new mongoose.Types.ObjectId(agencyId) } },
    {
      $group: {
        _id: "$source",
        total: { $sum: 1 },
        converted: {
          $sum: {
            $cond: [{ $eq: ["$status", "won"] }, 1, 0]
          }
        }
      }
    }
  ]);

  return leads.map((l) => ({
    source: l._id,
    quality: l.total === 0 ? 0 : (l.converted / l.total) * 100
  }));
};