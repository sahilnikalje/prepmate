import React from 'react'
import DashboardLayout from '../layout/DashboardLayout'

function ResourcesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-6xl text-[#48e5d0] mb-4">menu_book</span>
        <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-2">Resources</h2>
        <p className="text-on-surface-variant">Coming soon — learning resources will live here.</p>
      </div>
    </DashboardLayout>
  )
}

export default ResourcesPage