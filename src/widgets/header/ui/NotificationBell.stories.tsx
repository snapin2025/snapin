function NotificationBell({ notificationCount = 0 }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        fontSize: '24px',
        cursor: 'pointer',
        padding: '8px',
      }}
    >
      🔔
      {notificationCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {notificationCount}
        </span>
      )}
    </div>
  );
}

export default {
  title: 'Components/NotificationBell',
  component: NotificationBell,
};

export const WithNotifications = () => <NotificationBell notificationCount={3} />;
export const NoNotifications = () => <NotificationBell notificationCount={0} />;
