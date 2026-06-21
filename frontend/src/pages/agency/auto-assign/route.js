// app/api/agency/auto-assign/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { leadId, agencyId } = await req.json();

    // Query active telemetry metrics for all available agents within the agency tenant
    const agents = await prisma.agentProfile.findMany({
      where: { agencyId, status: 'ONLINE' },
      include: {
        _count: {
          select: {
            leads: { where: { NOT: { stage: { in: ['CLOSED_WON', 'LOST'] } } } },
          }
        },
        leads: {
          select: { propertyId: true }
        }
      }
    });

    if (agents.length === 0) {
      return NextResponse.json({ error: 'No available online agents' }, { status: 404 });
    }

    // Process optimal load configurations
    const ratedAgents = agents.map(agent => {
      const activeLeadsCount = agent._count.leads;
      
      // Pull unique assigned listing focus counters manually from system matching metrics
      const activeListingsCount = new Set(agent.leads.map(l => l.propertyId).filter(Boolean)).size;

      // Execute Capacity Formula
      const rawWorkloadScore = (activeLeadsCount * 1.5) + (activeListingsCount * 2.0);
      const workloadPct = (rawWorkloadScore / agent.maxLeadCapacity) * 100;

      return { agent, workloadPct };
    });

    // Sort ascending by workload percentage (find the least busy agent)
    ratedAgents.sort((a, b) => a.workloadPct - b.workloadPct);
    const targetAgent = ratedAgents[0].agent;

    // Persist Assignment Sequence
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        agentId: targetAgent.id,
        stage: 'ASSIGNED',
        timelineEvents: {
          create: {
            actorId: 'SYSTEM_ROUTER',
            title: 'Automated Load-Balanced Assignment',
            description: `Lead assigned automatically to Agent ${targetAgent.id} (Current Workload Pct: ${ratedAgents[0].workloadPct.toFixed(1)}%)`,
            eventIcon: 'cpu'
          }
        }
      }
    });

    return NextResponse.json({ success: true, assignedTo: targetAgent.id, updatedLead });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
