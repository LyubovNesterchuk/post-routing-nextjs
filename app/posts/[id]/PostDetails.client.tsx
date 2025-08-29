'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchPostById, fetchUserById } from '@/lib/api';
import css from './PostDetails.module.css';

export default function PostDetailsClient() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();

  // Запит на пост
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(id),
    refetchOnMount: false,
  });

  // Запит на користувача (автора)
  const { data: user } = useQuery({
    queryKey: ['user', post?.userId],
    queryFn: () => fetchUserById(post!.userId),
    enabled: !!post, // тільки коли пост завантажений
  });

  const handleClickBack = () => {
    router.back();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !post) return <p>Error loading post</p>;

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.item}>
          <button onClick={handleClickBack} className={css.backBtn}>
            ← Back
          </button>

          <div className={css.post}>
            <div className={css.wrapper}>
              <div className={css.header}>
                <h2>{post.title}</h2>
              </div>
              <p className={css.content}>{post.body}</p>
            </div>
            <p className={css.user}>Author: {user?.name ?? 'Unknown'}</p>
          </div>
        </div>
      </div>
    </main>
  );
}