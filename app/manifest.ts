import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dealping - Contract Management for Independent Professionals',
    short_name: 'Dealping',
    description: 'AI-powered contract management for independent professionals. Track contracts, get automated reminders, and never miss a renewal or rate increase again.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}

