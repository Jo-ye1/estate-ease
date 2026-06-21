'use client';
import React, { useEffect, useState } from 'react';
import AssignmentCenter from '@/components/agency/AssignmentCenter';

export default function AgencyAssignmentPage() {
  const [data, setData] = useState({ leads: [], agents: [] });
  const [loading, setLoading] = useState(true);

  // Hydrate workspace datasets on component lifecycle setup mount
  useEffect(() => {
    async function loadWorkspaceData() {
      try {
        const res = await fetch('/api/agency/workspace-data');
        const json = await res.json();
        if (json.success) {
          setData({ leads: json.leads, agents: json.agents });
        }
      } catch (err) {
        console.error('Failed to load agency CRM pool', err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkspaceData();
  }, []);

  // Handle live assignment action execution pipeline
  const handleAssignAction = async (leadId, agentId, priority) => {
    try {
      const res = await fetch('/api/agency/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, agentId, priority })
      });
      
      const json = await res.json();
      if (!json.success) {
        alert('Server rejected assignment workflow request execution.');
      }
    } catch (err) {
      console.error('Network execution failure routing lead target matrix', err);
    }
  };

  if (loading) {
    return <div className="p-8 bg-slate-950 text-slate-400 text-xs font-mono">Hydrating Enterprise Workspace Data Framework Engine...</div>;
  }

  return (
    <AssignmentCenter 
      initialLeads={data.leads} 
      initialAgents={data.agents} 
      onAssign={handleAssignAction} 
    />
  );
}
