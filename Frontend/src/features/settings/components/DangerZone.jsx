import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import settingsService from '../services/settingsService'
import { useUser } from '../../../context/UserContext'

export default function DangerZone() {
  const [showModal, setShowModal] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const navigate    = useNavigate()
  const { clearUser } = useUser()

  // STEP-1: Delete account — calls backend, clears user, redirects
  const handleDelete = async () => {
    setLoading(true)
    setError('')
    try {
      await settingsService.deleteAccount()
      clearUser()
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="rounded-3xl p-8 border border-error/20 bg-error/5 space-y-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error"
            style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          <h2 className="font-headline font-bold text-2xl text-error">Danger Zone</h2>
        </div>

        <p className="text-on-surface-variant text-sm leading-relaxed">
          Once you delete your account, there is no going back. All interviews, analytics,
          resources progress, settings, and account data will be permanently removed.
        </p>

        <button
          onClick={() => setShowModal(true)}
          className="px-8 py-3 rounded-full border border-error text-error font-bold text-sm hover:bg-error/10 transition-all active:scale-95"
        >
          Delete Account
        </button>
      </div>

      {/* STEP-2: Confirmation modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl w-full max-w-md p-8 border border-error/30 space-y-6">

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-error text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}>
                delete_forever
              </span>
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-headline font-bold text-2xl text-on-surface">Are you absolutely sure?</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                This action cannot be undone. All interview history, analytics reports,
                resources progress, settings, and account data will be permanently removed.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-full bg-surface-container-high text-on-surface font-semibold hover:bg-surface-variant transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-3 rounded-full bg-error text-white font-bold hover:bg-error/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Deleting...
                  </>
                ) : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}