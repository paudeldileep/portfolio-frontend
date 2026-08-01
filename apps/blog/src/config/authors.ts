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
    role: 'Frontend-focused full-stack engineer',
    bio: 'Writing about accessible interfaces, durable frontend systems, and practical AI-assisted engineering.',
  },
  shraddha: {
    id: 'shraddha',
    name: 'Shraddha',
    role: 'Full-stack engineer',
    bio: 'Building with Java and Spring Boot while exploring practical AI development.',
  },
} as const satisfies Record<string, AuthorProfile>;

export type AuthorId = keyof typeof AUTHORS;

export function getAuthor(authorId: string): AuthorProfile | undefined {
  return AUTHORS[authorId as AuthorId];
}
