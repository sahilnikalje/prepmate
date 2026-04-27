import DashboardLayout from "../layout/DashboardLayout"

export default function PracticePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-6xl text-primary mb-4">psychology</span>
        <h2 className="text-3xl font-extrabold font-headline text-on-surface mb-2">Practice</h2>
        <p className="text-on-surface-variant">Coming soon — AI mock interviews will live here.</p>
      </div>
    </DashboardLayout>
  )
}