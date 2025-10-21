function LanguageSelector() {
  return (
    <div
      style={{
        position: 'relative',
        width: '163px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        backgroundColor: 'transparent',
        border: '1px solid #333',
        borderRadius: '2px',
      }}
    >
      <div
        style={{
          flex: 1,
          color: '#fff',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23fff' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          paddingRight: '20px',
        }}
      >
        🇬🇧 English
      </div>
    </div>
  );
}

export default {
  title: 'Components/LanguageSelector',
  component: LanguageSelector,
};

export const Default = () => (
  <div style={{ backgroundColor: '#000', padding: '20px' }}>
    <LanguageSelector />
  </div>
);
