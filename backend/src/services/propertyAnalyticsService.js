import PropertyAnalytics from "../models/PropertyAnalytics.js";
import Property from "../models/Property.js";

export const initializePropertyAnalytics = async (propertyId) => {
  const existing = await PropertyAnalytics.findOne({
    property: propertyId,
  });

  if (existing) return existing;

  return await PropertyAnalytics.create({
    property: propertyId,
  });
};

export const trackPropertyView = async (propertyId) => {
  let analytics = await initializePropertyAnalytics(propertyId);

  analytics.views += 1;
  analytics.lastUpdated = new Date();

  await analytics.save();
};

export const trackFavorite = async (propertyId) => {
  let analytics = await initializePropertyAnalytics(propertyId);

  analytics.favorites += 1;
  analytics.lastUpdated = new Date();

  await analytics.save();
};

export const trackLeadRequest = async (propertyId) => {
  let analytics = await initializePropertyAnalytics(propertyId);

  analytics.leadRequests += 1;
  analytics.lastUpdated = new Date();

  if (!analytics.firstLeadAt) {
    analytics.firstLeadAt = new Date();
  }

  await analytics.save();
};

export const trackApprovalSubmission = async (propertyId) => {
  let analytics = await initializePropertyAnalytics(propertyId);

  analytics.approvalSubmittedAt = new Date();
  analytics.lastUpdated = new Date();

  await analytics.save();
};

export const trackPublishDate = async (propertyId) => {
  let analytics = await initializePropertyAnalytics(propertyId);

  analytics.publishedAt = new Date();
  analytics.lastUpdated = new Date();

  await analytics.save();
};

export const trackLeadConversion = async (propertyId) => {
  let analytics = await initializePropertyAnalytics(propertyId);

  analytics.convertedLeads += 1;
  analytics.closedAt = new Date();
  analytics.lastUpdated = new Date();

  await analytics.save();
};

export const updateDaysOnMarket = async (propertyId) => {
  const property = await Property.findById(propertyId);

  if (!property) return;

  let analytics = await initializePropertyAnalytics(propertyId);

  const createdDate = new Date(property.createdAt);
  const now = new Date();

  const days =
    Math.floor(
      (now - createdDate) / (1000 * 60 * 60 * 24)
    );

  analytics.daysOnMarket = days;

  await analytics.save();
};
