import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utilitário de classes no padrão shadcn (clsx + tailwind-merge). */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
