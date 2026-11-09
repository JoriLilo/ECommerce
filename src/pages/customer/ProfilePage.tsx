import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { getUser, updateSavedUser } from '../../utils/auth'
import { updateMyProfile } from '../../services/userService'
import ErrorMessage from '../../components/common/ErrorMessage'
import SubmitButton from '../../components/ui/SubmitButton'

// Displays account information and lets the user edit their full name.
export default function ProfilePage() {
  const [user, setUser] = useState(getUser)
  const [fullName, setFullName] = useState(user?.fullName ?? '')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Starts editing with the currently saved name.
  function handleEdit() {
    setFullName(user?.fullName ?? '')
    setError(null)
    setEditing(true)
  }

  function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
    setFullName(event.target.value)
  }

  // Discards unsaved changes.
  function handleCancel() {
    setFullName(user?.fullName ?? '')
    setError(null)
    setEditing(false)
  }

  // Saves through the backend before updating the displayed account.
  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return

    const name = fullName.trim()

    if (!name) {
      setError('Please enter your full name.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const updatedUser = await updateMyProfile({ fullName: name })

      updateSavedUser(updatedUser)
      setUser(updatedUser)
      setFullName(updatedUser.fullName)
      setEditing(false)
    } catch (err) {
      setError(
        err instanceof Error && err.message.trim()
          ? err.message
          : 'Could not update your profile. Please try again.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="content-page" aria-labelledby="profile-title">
      <h1 id="profile-title">My profile</h1>
      <p className="page-subtitle">Your account information.</p>

      <ErrorMessage message={error} />

      {editing ? (
        <form className="card profile-details" onSubmit={handleSave}>
          <label htmlFor="profile-full-name ">Full name: </label>
          <input className="form-input"
            id="profile-full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={handleNameChange}
            disabled={saving}
            required
          />

          <p>Email: {user?.email}</p>
          <p>Account type: {user?.role}</p>

          <SubmitButton  loading={saving} text="Save changes" loadingText="Saving…" />

          <div className="btn-primary">
            <button type="submit">
             
            </button>

            <button className="btn-primary"
              type="button"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <dl className="card profile-details">
            <dt>Full name</dt>
            <dd>{user?.fullName}</dd>
            <dt>Email</dt>
            <dd>{user?.email}</dd>
            <dt>Account type</dt>
            <dd>{user?.role}</dd>
          </dl>

          <button type="button" onClick={handleEdit}>
            Edit profile
          </button>
        </>
      )}
    </section>
  )
}