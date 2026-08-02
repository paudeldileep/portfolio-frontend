import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { ArticleNavigation } from '../../src/components/posts/ArticleNavigation';
import { PostCard } from '../../src/components/posts/PostCard';
import { getPublishedPosts, type PostSummary } from '../../src/lib/content/posts';

function getFixturePost(overrides: Partial<PostSummary> = {}): PostSummary {
  const post = getPublishedPosts()[0];

  if (!post) {
    throw new Error('A published post fixture is required for component tests.');
  }

  return { ...post, ...overrides };
}

describe('PostCard', () => {
  it('exposes article, topic, date, author, and reading metadata', () => {
    const post = getFixturePost();
    render(<PostCard post={post} />);

    expect(
      screen.getByRole('link', { name: post.title }),
    ).toHaveAttribute('href', `/${post.slug}`);
    expect(
      screen.getByRole('list', { name: 'Article topics' }),
    ).toBeInTheDocument();
    expect(screen.getByText(post.authorProfile.name)).toBeInTheDocument();
    expect(screen.getByText(post.readingTime)).toBeInTheDocument();
    expect(screen.getByText(post.tags[0]).closest('a')).toHaveAttribute(
      'href',
      `/tag/${post.tagSlugs[0]}`,
    );
    expect(
      screen.getByText(post.readingTime).previousElementSibling,
    ).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = render(<PostCard post={getFixturePost()} />);
    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });
});

describe('ArticleNavigation', () => {
  it('renders nothing when neither adjacent article exists', () => {
    const { container } = render(<ArticleNavigation />);

    expect(container).toBeEmptyDOMElement();
  });

  it('labels and links both navigation directions', () => {
    const previousPost = getFixturePost({
      slug: 'older-article',
      title: 'Older article',
    });
    const nextPost = getFixturePost({
      slug: 'newer-article',
      title: 'Newer article',
    });

    render(
      <ArticleNavigation
        previousPost={previousPost}
        nextPost={nextPost}
      />,
    );

    const navigation = screen.getByRole('navigation', {
      name: 'Article navigation',
    });
    expect(navigation).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Previous article Older article/i }),
    ).toHaveAttribute('href', '/older-article');
    expect(
      screen.getByRole('link', { name: /Next article Newer article/i }),
    ).toHaveAttribute('href', '/newer-article');
  });

  it('has no automatically detectable accessibility violations', async () => {
    const { container } = render(
      <ArticleNavigation
        previousPost={getFixturePost({
          slug: 'older-article',
          title: 'Older article',
        })}
        nextPost={getFixturePost({
          slug: 'newer-article',
          title: 'Newer article',
        })}
      />,
    );
    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });
});
