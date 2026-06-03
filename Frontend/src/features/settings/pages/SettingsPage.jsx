import { useState, useEffect } from 'react'
import DashboardLayout from '../../dashboard/layout/DashboardLayout'
import AIPreferences from '../components/AIPreferences'
import AppearanceSection from '../components/AppearanceSection'
import SecuritySection from '../components/SecuritySection'
import DangerZone from '../components/DangerZone'
import settingsService from '../services/settingsService'

// ─── Helper: apply theme to DOM + persist ─────────────────────────────────────
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('prepmate-theme', t)
}

export default function SettingsPage() {
  const [voice,    setVoice]    = useState('female')
  const [autoSave, setAutoSave] = useState(true)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState('')
  const [error,    setError]    = useState('')

  //todo STEP-1: Theme — localStorage is ALWAYS the source of truth for display
  // Never let the backend DB overwrite what's currently shown on screen
  const [theme, setTheme] = useState(
    () => localStorage.getItem('prepmate-theme') || 'dark'
  )

  //todo STEP-2: Load voice + autoSave from backend on mount
  // We do NOT touch theme here — localStorage already has the right value
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings()
        setVoice(data.settings?.voicePreference ?? 'female')
        setAutoSave(data.settings?.autoSave ?? true)

        // Only sync theme from DB if this is a brand new user with nothing in localStorage
        if (!localStorage.getItem('prepmate-theme') && data.settings?.theme) {
          setTheme(data.settings.theme)
          applyTheme(data.settings.theme)
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  //todo STEP-3: When user picks a theme — apply immediately to DOM + localStorage
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  //todo STEP-4: Save ALL preferences to backend + sync voice to localStorage
  // Voice is stored in localStorage so useSpeech can read it without an API call
  const handleSavePreferences = async () => {
    if (saving) return
    setSaving(true)
    setSuccess('')
    setError('')
    try {
      await settingsService.updateSettings({ voicePreference: voice, theme, autoSave })
      localStorage.setItem('prepmate-voice', voice)   // <-- useSpeech reads this
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
      <div className="fixed top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-64 w-[300px] h-[300px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 space-y-8 pb-12">
        <header>
          <h1 className="font-headline text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight">
            Settings
          </h1>
          <p className="text-on-surface-variant mt-2">
            Customize your AI interview experience and account preferences.
          </p>
        </header>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <svg className="w-10 h-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          </div>
        )}

        {!loading && (
          <>
            <AIPreferences
              voice={voice}
              autoSave={autoSave}
              onVoiceChange={setVoice}
              onAutoSaveChange={setAutoSave}
            />

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
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Saving Preferences...
                  </>
                ) : 'Save Preferences'}
              </button>
            </div>

            <AppearanceSection theme={theme} onThemeChange={handleThemeChange} />
            <SecuritySection />
            <DangerZone />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}