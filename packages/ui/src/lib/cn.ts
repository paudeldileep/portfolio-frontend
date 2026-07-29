/**
 * cn() — Class Name Utility
 * Merges Tailwind classes intelligently (handles conflicts like `px-2 px-4` → `px-4`).
 * Used by every component in this library.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
