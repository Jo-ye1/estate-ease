import Revenue from "../models/Revenue.js";

export const logRevenue = async ({
  user,
  property,
  type,
  amount,
  source,
}) => {
  return await Revenue.create({
    user,
    property,
    type,
    amount,
    source,
  });
};