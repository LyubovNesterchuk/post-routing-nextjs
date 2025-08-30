import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchPostById } from '@/lib/api';
import PostDetailsClient from './PostDetails.client';
import type { Metadata } from 'next';


type PostDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PostDetailsProps): Promise<Metadata> {
  const {id} = await params;
  const post = await fetchPostById(Number(id));
  
  console.log(post);

  return {
    title: `Post: ${post.title}`,
    description: `${post.body.slice(0, 30)}...`,
  };
}

export default async function PostDetails({ params }: PostDetailsProps) {
  const {id} = await params;
  console.log(typeof id);
  
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(Number(id)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostDetailsClient />
    </HydrationBoundary>
  );
}

