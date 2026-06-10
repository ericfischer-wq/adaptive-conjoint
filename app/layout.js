import './globals.css'

export const metadata = {
  title: 'Adaptive Conjoint Survey',
  description: 'Feature preference research'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
