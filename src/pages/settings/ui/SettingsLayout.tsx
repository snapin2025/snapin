// Обертка над всеми страницами настроек
'use client';

export function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/*Возможность переключения вкладок*/}
      <nav></nav>

      <div>
        {/*Рендер текущей вкладки */}
        {children}
      </div>
    </div>
  );
}
