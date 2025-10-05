"use client";

import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type Props = Omit<ImageProps, 'src' | 'alt'> & {
  src?: ImageProps['src'];
  alt?: string;
  fallbackSrc?: string;
};

export function ImageWithFallback({
  src,
  alt = '',
  className = '',
  width = 400,
  height = 600,
  fallbackSrc = ERROR_IMG_SRC,
  ...rest
}: Props) {
  const [didError, setDidError] = useState(false);

  const displaySrc = didError || !src ? fallbackSrc : src;

  return (
    <Image
      src={displaySrc as any}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setDidError(true)}
      unoptimized // avoid Next image loader issues with arbitrary external URLs in dev
      {...(rest as any)}
    />
  );
}
