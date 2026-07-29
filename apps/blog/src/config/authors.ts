export type AuthorProfile = {
  id: string;
  name: string;
  role: string;
  bio: string;
};

export const AUTHORS = {
  dileep: {
    id: 'dileep',
    name: 'Dileep T',
    role: 'Frontend architect and engineer',
    bio: 'Writing about accessible interfaces, durable frontend systems, and practical AI-assisted engineering.',
  },
} as const satisfies Record<string, AuthorProfile>;

export type AuthorId = keyof typeof AUTHORS;

export function getAuthor(authorId: string): AuthorProfile | undefined {
  return AUTHORS[authorId as AuthorId];
}
