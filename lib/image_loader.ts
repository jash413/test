// file : /lib/image_loader.ts

import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import api from '@/server/axios';

interface ImageData {
  data: string;
  contentType: string;
  contentDisposition?: string;
}

interface CacheSystem {
  get(key: string): ImageData | null;
  set(key: string, value: ImageData): void;
}

class FileCache implements CacheSystem {
  private cacheDir: string;

  constructor() {
    this.cacheDir = join(process.cwd(), '.next/cache/images');
    if (!existsSync(this.cacheDir)) {
      mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  get(key: string): ImageData | null {
    const cachePath = join(this.cacheDir, `${key}.json`);
    if (existsSync(cachePath)) {
      return JSON.parse(readFileSync(cachePath, 'utf-8'));
    }
    return null;
  }

  set(key: string, value: ImageData): void {
    const cachePath = join(this.cacheDir, `${key}.json`);
    writeFileSync(cachePath, JSON.stringify(value));
  }
}

class MemoryCache implements CacheSystem {
  private cache: Map<string, ImageData>;

  constructor() {
    this.cache = new Map();
  }

  get(key: string): ImageData | null {
    return this.cache.get(key) || null;
  }

  set(key: string, value: ImageData): void {
    this.cache.set(key, value);
  }
}

const useMemoryCache = process.env.USE_MEMORY_CACHE === 'true';
const cacheSystem: CacheSystem = useMemoryCache
  ? new MemoryCache()
  : new FileCache();

export async function cachedFetchImage(
  shortCode: string,
  token: string
): Promise<ImageData> {
  const cacheKey = `${shortCode}`;

  const cachedData = cacheSystem.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const download_url = `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api/download/${shortCode}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'image/*',
      Connection: 'keep-alive'
    };

    const response = await api.get(download_url, {
      headers,
      responseType: 'arraybuffer'
    });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    const imageData: ImageData = {
      data: base64,
      contentType: response.headers['content-type'],
      contentDisposition: response.headers['content-disposition']
    };

    // Cache the image data
    cacheSystem.set(cacheKey, imageData);

    return imageData;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw error;
  }
}
