// lib/finance/commission-calculator.ts
import { Decimal } from 'decimal.js';

interface CommissionSplitInput {
  salePrice: number;
  agencyBaseCommissionPct: number; // e.g. 5.00 for 5%
  agentCustomSplitPct: number;    // e.g. 70.00 for 70% of agency share
  platformSaaSAllocationPct: number; // Platform take rate fee e.g. 2.50%
}

export function calculateDealLedger(input: CommissionSplitInput) {
  const price = new Decimal(input.salePrice);
  const agencyCommPct = new Decimal(input.agencyBaseCommissionPct).div(100);
  const agentSplitPct = new Decimal(input.agentCustomSplitPct).div(100);
  const platformFeePct = new Decimal(input.platformSaaSAllocationPct).div(100);

  // Compute absolute allocations
  const grossCommission = price.mul(agencyCommPct);
  const platformFee = grossCommission.mul(platformFeePct);
  const totalWithheldTaxes = grossCommission.mul(0.12); // standard structural regional withholding framework flat projection

  const netBrokeragePool = grossCommission.sub(platformFee);
  const agentSplit = netBrokeragePool.mul(agentSplitPct);
  const agencySplit = netBrokeragePool.sub(agentSplit);
  const netIncome = agencySplit.sub(totalWithheldTaxes);

  return {
    salePrice: price.toFixed(2),
    grossCommission: grossCommission.toFixed(2),
    platformFee: platformFee.toFixed(2),
    agencySplit: agencySplit.toFixed(2),
    agentSplit: agentSplit.toFixed(2),
    taxes: totalWithheldTaxes.toFixed(2),
    netIncome: netIncome.toFixed(2),
  };
}
