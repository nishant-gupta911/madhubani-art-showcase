import React from 'react';
import { PosterFooter } from './layout/PosterFooter/PosterFooter';

export interface FooterProps {
  variant?: 'poster' | 'compact';
}

export const Footer: React.FC<FooterProps> = ({ variant = 'poster' }) => {
  return <PosterFooter variant={variant} />;
};
