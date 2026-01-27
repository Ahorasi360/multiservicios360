export const metadata = {
  title: 'Multi Servicios 360',
  description: 'Legal document preparation services',
  verification: {
    google: 'google6dee70b79b4cd078',
    other: {
      'msvalidate.01': 'B31244A5BEB800476FBFDBB970B09C56',
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}