import { getCurrentUser } from 'auth/currentUser';

export default async function Profile() {
  const currentUser = await getCurrentUser({ redirectIfNotFound: true })
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15vh' }}>
        {/* {loading ? (
          <h2>Loading...</h2>
        ) : username ? (
        ) : (
          <h1>Welcome!</h1>
        )} */}
        <h1>Welcome, {currentUser.username}!</h1>
      </div>
    </div>
  );
}
