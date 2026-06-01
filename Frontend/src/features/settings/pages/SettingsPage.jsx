import { useState, useEffect } from 'react'
import DashboardLayout   from '../../dashboard/layout/DashboardLayout'
import AIPreferences     from '../components/AIPreferences'
import AppearanceSection from '../components/AppearanceSection'
import SecuritySection   from '../components/SecuritySection'
import DangerZone        from '../components/DangerZone'
import settingsService   from '../services/settingsService'

export default function SettingsPage() {
  const [voice,    setVoice]    = useState('female')
  const [theme,    setTheme]    = useState('dark')
  const [autoSave, setAutoSave] = useState(true)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')

  //todo STEP-1: Load saved settings from backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings()
        setVoice(data.settings?.voicePreference ?? 'female')
        setTheme(data.settings?.theme           ?? 'dark')
        setAutoSave(data.settings?.autoSave     ?? true)
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  //todo STEP-2: Apply theme to document root
  //* So theme works across whole app
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  //todo STEP-3: Save preferences to backend
  const handleSavePreferences = async () => {
    if (saving) return  // prevent double click
    setSaving(true)
    setSuccess('')
    setError('')
    try {
      await settingsService.updateSettings({ voicePreference: voice, theme, autoSave })
      setSuccess('Preferences saved successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>

      {/*//* Atmospheric glows */}
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-64 w-[300px] h-[300px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 space-y-8 pb-12">

        {/*//* Header */}
        <header>
          <h1 className="font-headline text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight">
            Settings
          </h1>
          <p className="text-on-surface-variant mt-2">
            Customize your AI interview experience and account preferences.
          </p>
        </header>

        {/*//* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <svg className="w-10 h-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}

        {!loading && (
          <>
            {/*//* STEP-4: AI Preferences */}
            <AIPreferences
              voice={voice}
              autoSave={autoSave}
              onVoiceChange={setVoice}
              onAutoSaveChange={setAutoSave}
            />

            {/*//* STEP-5: Save Preferences CTA + feedback */}
            <div className="space-y-3">
              {success && (
                <div className="p-3 rounded-xl bg-[#48e5d0]/10 border border-[#48e5d0]/30 text-[#48e5d0] text-sm text-center">
                  ✓ {success}
                </div>
              )}
              {error && (
                <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm text-center">
                  {error}
                </div>
              )}
              <button
                onClick={handleSavePreferences}
                disabled={saving}
                className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-full shadow-[0_0_20px_rgba(163,166,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Saving Preferences...
                  </>
                ) : 'Save Preferences'}
              </button>
            </div>

            {/*//* STEP-6: Appearance */}
            <AppearanceSection theme={theme} onThemeChange={setTheme} />

            {/*/* STEP-7: Security */}
            <SecuritySection />

            {/*//* STEP-8: Danger Zone */}
            <DangerZone />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}