import './styles/index.css';
import { ReactNode } from 'react';
import Header from '@/widgets/header/Header';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {/*header*/}
        <Header />
        {children}
      </body>
    </html>
  );
}
