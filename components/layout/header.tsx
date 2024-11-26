// file: components/layout/Header.tsx

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { auth } from '@/auth';
import { cachedFetchImage } from '@/lib/image_loader';
import HeaderDropdown from './HeaderDropDown';

const generateSvgBackground = (text: string, width: number, height: number) => {
  const letters = text.split('');
  const searchBarWidth = width * 0.4; // Estimate search bar width as 40% of total width
  const dropdownWidth = width * 0.15; // Estimate dropdown width as 15% of total width
  const leftSideWidth = (width - searchBarWidth - dropdownWidth) * 0.6; // 60% of remaining space for left side
  const rightSideWidth = (width - searchBarWidth - dropdownWidth) * 0.4; // 40% of remaining space for right side

  // Split letters into two groups
  const leftLetterCount = Math.ceil(letters.length * 0.6);
  const leftLetters = letters.slice(0, leftLetterCount);
  const rightLetters = letters.slice(leftLetterCount);

  const generateLetterElements = (
    letters: string[],
    startX: number,
    endX: number
  ) => {
    const spacing = (endX - startX) / (letters.length + 1);
    return letters
      .map(
        (letter, index) => `
      <text
        x="${startX + spacing * (index + 1)}"
        y="${height / 2}"
        font-family="Arial, sans-serif"
        font-size="24"
        fill="rgba(150, 150, 150, 0.2)"
        text-anchor="middle"
        dominant-baseline="middle"
      >${letter}</text>
    `
      )
      .join('');
  };

  const leftElements = generateLetterElements(leftLetters, 0, leftSideWidth);
  const rightElements = generateLetterElements(
    rightLetters,
    leftSideWidth + searchBarWidth,
    leftSideWidth + searchBarWidth + rightSideWidth
  );

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      ${leftElements}
      ${rightElements}
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svgString).toString(
    'base64'
  )}`;
};

const Header = async () => {
  const session = await auth();
  let imageUrl = null;
  if (session?.user?.image) {
    // const imageData = await fetchImage(
    //   session.user.image,
    //   session.user.apiUserToken

    try {
      const imageData = await cachedFetchImage(
        session.user.image,
        session.user.apiUserToken
      );
      imageUrl = `data:${imageData.contentType};base64,${imageData.data}`;
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }

  const businessName =
    session?.user?.business_info?.business_name || 'Business Name';

  // Generate background SVG
  const backgroundImage = generateSvgBackground(businessName, 1000, 40);

  return (
    <header className="relative flex items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--header-bg))] px-4 py-2">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover'
        }}
      />
      <h1 className="z-10 text-xl font-bold text-[hsl(var(--foreground))]"></h1>

      <div className="z-10 mx-4 max-w-xl flex-1">
        <div className="relative">
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 transform text-[hsl(var(--muted-foreground))]"
            size={16}
          />
          <Input
            type="text"
            placeholder="Search..."
            className="h-8 border-[hsl(var(--border))] bg-[hsl(var(--background))] py-1 pl-8 text-[hsl(var(--foreground))]"
          />
        </div>
      </div>

      <HeaderDropdown
        userName={session?.user?.name || ''}
        imageUrl={imageUrl}
      />
    </header>
  );
};

export default Header;
