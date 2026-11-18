import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import CompareBar from '@/components/CompareBar';
import BackToTop from '@/components/BackToTop';

export const metadata = {
  title: 'Watcheton Timepieces — Time Elevated',
  description: 'Automatic and quartz watches with the Watcheton W. Free delivery across Pakistan.',
  icons: { icon: '/images/logo.webp' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CompareBar />
        <BackToTop />
        <WhatsAppFloat />
        <ScrollReveal />
      </body>
    </html>
  );
}
