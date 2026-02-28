import './globals.css'

export const metadata = {
  title: 'Multi Servicios 360 | Self-Service Legal Document Software',
  description: 'Create your own Power of Attorney, Living Trust, and business documents. Bilingual self-service legal software platform for California. You prepare your own documents.',
  keywords: 'power of attorney, POA, legal documents, California, Spanish, bilingual, self-service, document software',
  verification: {
    google: 'google6dee70b79b4cd078',
    other: {
      'msvalidate.01': '5A812EC19201D8F827C57F3900AA4FC3',
    },
  },
  openGraph: {
    title: 'Multi Servicios 360 | Self-Service Legal Document Software',
    description: 'Create your own Power of Attorney and legal documents. Bilingual self-service platform.',
    url: 'https://multiservicios360.net',
    siteName: 'Multi Servicios 360',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}