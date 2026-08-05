import { z } from 'zod';
import type { AdminPortfolio } from '@/lib/admin-api';

export const portfolioProfileFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a professional title.').max(160),
  summary: z.string().trim().min(1, 'Add at least one summary paragraph.').max(12_000),
});

export type PortfolioProfileFormValues = z.infer<typeof portfolioProfileFormSchema>;

export function toPortfolioProfileFormValues(portfolio: AdminPortfolio): PortfolioProfileFormValues {
  return {
    title: portfolio.content.profile.title,
    summary: portfolio.content.profile.summary.join('\n\n'),
  };
}

export function profileValuesToContent(
  portfolio: AdminPortfolio,
  values: PortfolioProfileFormValues
) {
  return {
    ...portfolio.content,
    profile: {
      title: values.title.trim(),
      summary: values.summary
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    },
  };
}
