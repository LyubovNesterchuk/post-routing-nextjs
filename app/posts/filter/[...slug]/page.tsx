import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchPosts } from '@/lib/api';
import PostsClient from './Posts.client';
import { Metadata } from 'next';

type PostsPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: PostsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const userId = slug?.[0] ?? "All";

  return {
    title: userId === "All" ? "Posts - All Users" : `Posts - User ${userId}`,
  };
}


export default async function PostsPage({ params }: PostsPageProps) {
  const { slug } = await params;
  const userId = slug[0] ?? "All";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts", { searchText: "", page: 1, userId }],
    queryFn: () =>
      fetchPosts({
        searchText: "",
        page: 1,
        ...(userId !== "All" && { userId }),
      }),
  });

  const initialData = await fetchPosts({
    searchText: "",
    page: 1,
    ...(userId !== "All" && { userId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsClient initialData={initialData} userId={userId} />
    </HydrationBoundary>
  );
}



