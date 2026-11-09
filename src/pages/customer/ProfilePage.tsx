import { getUser } from '../../utils/auth'

// Displays account details; navigation is provided by AccountLayout.
export default function ProfilePage() {
  const user = getUser()

  return (
    <section className="content-page" aria-labelledby="profile-title">
      <h1 id="profile-title">My profile</h1>
      <p className="page-subtitle">Your account information.</p>
      <dl className="card profile-details">
        <dt>Full name</dt>
        <dd>{user?.fullName}</dd>
        <dt>Email</dt>
        <dd>{user?.email}</dd>
        <dt>Account type</dt>
        <dd>{user?.role}</dd>
      </dl>
      <p>Profile editing will be available when account updates are supported.</p>
    </section>
  )
}
