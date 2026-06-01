import { useState } from 'react'
import settingsService from '../services/settingsService'

export default function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent,     setShowCurrent]     = useState(false)
  const [showNew,         setShowNew]         = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [loading,         setLoading]         = useState(false)
  const [success,         setSuccess]         = useState('')
  const [error,           setError]           = useState('')

  const inputClass = "w-full h-12 bg-surface-container-highest rounded-xl pl-4 pr-12 text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"

  // STEP-1: Handle password change
  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await settingsService.changePassword({ currentPassword, newPassword })
      setSuccess('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel rounded-3xl p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-[#48e5d0]"
          style={{ fontVariationSettings: "'FILL' 1" }}>
          shield
        </span>
        <h2 className="font-headline font-bold text-2xl text-on-surface">Security & Privacy</h2>
      </div>

      {/* Feedback */}
      {success && (
        <div className="p-3 rounded-xl bg-[#48e5d0]/10 border border-[#48e5d0]/30 text-[#48e5d0] text-sm text-center">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm text-center">
          {error}
        </div>
      )}

      {/* Password fields */}
      <div className="space-y-4">

        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
            <button
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-sm">
                {showCurrent ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>

        {/* New + Confirm — side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">New Password</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
              <button
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">
                  {showNew ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">
                  {showConfirm ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-bold rounded-full hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Updating Password...
          </>
        ) : 'Update Password'}
      </button>
    </div>
  )
}