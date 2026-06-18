export const PLANS = {
  free: {
    maxProperties: 3,
    maxImagesPerProperty: 5,
    canBoost: false,
    canFeature: false,
    analyticsAccess: false,
  },

  pro: {
    maxProperties: 20,
    maxImagesPerProperty: 15,
    canBoost: true,
    canFeature: true,
    analyticsAccess: true,
  },

  agency: {
    maxProperties: 100,
    maxImagesPerProperty: 25,
    canBoost: true,
    canFeature: true,
    analyticsAccess: true,
  },

  enterprise: {
    maxProperties: -1,
    maxImagesPerProperty: -1,
    canBoost: true,
    canFeature: true,
    analyticsAccess: true,
  },
};
