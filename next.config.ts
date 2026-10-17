import type {NextConfig} from 'next'
import {sanity} from 'next-sanity/live/cache-life'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    default: sanity,
  },
  images: {
    // Sanity's image CDN does the resizing and format negotiation.
    loader: 'custom',
    loaderFile: './src/sanity/image-loader.ts',
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
