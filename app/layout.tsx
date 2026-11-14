import type { Metadata } from 'next';
import './globals.css';
import './sections.css';
import './tool-art.css';
import { siteConfig } from '@/lib/site';
export const metadata: Metadata = {
  title: `${siteConfig.brand.name} ${siteConfig.brand.division} — ${siteConfig.seo.title}`, 
  description: siteConfig.seo.description,
  keywords: ['industrial tools','power tools','construction equipment','hardware supplier'],
  openGraph: { title: `${siteConfig.brand.name} ${siteConfig.brand.division}`, description: siteConfig.seo.description, type: 'website' }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
