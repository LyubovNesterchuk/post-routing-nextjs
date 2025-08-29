import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { fetchPosts } from '@/lib/api';

import PostsClient from './Posts.client';


type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function PostsPage({ params }: Props) {
  const { slug = [] } = await params;
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