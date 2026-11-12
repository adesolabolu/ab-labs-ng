import { ImageResponse } from 'next/og';
import { OgCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og-card';

export const alt = 'aB Labs — High-performance websites for ambitious brands';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function TwitterImage() {
  return new ImageResponse(<OgCard />, { ...OG_SIZE });
}
