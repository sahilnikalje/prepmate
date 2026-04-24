import React from 'react'
import DashboardLayout from '../components/DashboardLayout'

function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-6xl text-secondary mb-4">insights</span>
        <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-2">Analytics</h2>
        <p className="text-on-surface-variant">Coming soon — your performance insights will live here.</p>
      </div>
    </DashboardLayout>
  )
}

export default AnalyticsPage