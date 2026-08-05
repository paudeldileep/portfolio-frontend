import { describe, expect, it } from 'vitest';
import { profileValuesToContent, portfolioProfileFormSchema, toPortfolioProfileFormValues } from '@/lib/portfolio-form';

const portfolio = {
  version: 4,
  content: {
    profile: { title: 'Frontend Engineer', summary: ['First paragraph.', 'Second paragraph.'] },
    skills: { frontend_engineering: ['React'] },
    experience: [],
    education: [],
    certifications: [],
  },
};

describe('portfolio profile form contract', () => {
  it('uses blank lines to preserve separate public about paragraphs', () => {
    expect(toPortfolioProfileFormValues(portfolio).summary).toBe('First paragraph.\n\nSecond paragraph.');
  });

  it('updates only profile content while preserving the remaining document', () => {
    const content = profileValuesToContent(portfolio, {
      title: 'Full Stack Engineer',
      summary: 'One.\n\nTwo.',
    });

    expect(content.profile).toEqual({ title: 'Full Stack Engineer', summary: ['One.', 'Two.'] });
    expect(content.skills).toEqual({ frontend_engineering: ['React'] });
  });

  it('rejects an empty profile before it reaches the API', () => {
    expect(portfolioProfileFormSchema.safeParse({ title: '', summary: '' }).success).toBe(false);
  });
});
