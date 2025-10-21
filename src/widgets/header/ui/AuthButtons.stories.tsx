function AuthButtons() {
  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        style={{
          height: '36px',
          padding: '0 24px',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '2px',
          cursor: 'pointer',
          backgroundColor: 'transparent',
          color: '#fff',
          border: '1px solid #fff',
        }}
      >
        Log in
      </button>
      <button
        style={{
          height: '36px',
          padding: '0 24px',
          fontSize: '14px',
          fontWeight: '600',
          borderRadius: '2px',
          cursor: 'pointer',
          backgroundColor: '#397df6',
          color: '#fff',
          border: 'none',
        }}
      >
        Sign up
      </button>
    </div>
  );
}

export default {
  title: 'Components/AuthButtons',
  component: AuthButtons,
};

export const LoginAndSignup = () => <AuthButtons />;
