import { notFound } from 'next/navigation';
import { PostEditor } from '@/components/PostEditor';
import { getAdminPost } from '@/lib/admin-api';

export const metadata = { title: 'Edit article' };

export default async function EditPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(postId)) notFound();

  const post = await getAdminPost(postId);
  return <PostEditor post={post} />;
}
