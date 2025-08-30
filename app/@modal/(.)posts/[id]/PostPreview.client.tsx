'use client';

import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import css from './PostPreview.module.css';

export default function PostPreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(Number(id)),
    refetchOnMount: false,
  });

  const { data: user } = useQuery({
    queryKey: ['user', post?.userId],  // якщо post існує, то візьми post.userId, інакше поверни undefined
    queryFn: () => fetchUserById(post!.userId), // post тут не null і не undefined
    enabled: !!post, // виконується лише після завантаження поста
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return <Modal onClose={handleClose}>Loading, please wait...</Modal>;
  }

  if (isError || !post) {
    return <Modal onClose={handleClose}>Something went wrong...</Modal>;
  }

  return (
    <Modal onClose={handleClose}>
      <button className={css.backBtn} onClick={handleClose}>
        ← Back
      </button>

      <div className={css.post}>
        <div className={css.wrapper}>
          <div className={css.header}>
            <h2>{post.title}</h2>
          </div>
          <p className={css.content}>{post.body}</p>
        </div>
        <p className={css.user}>{user?.name ?? 'Loading author...'}</p>
      </div>
      
    </Modal>
  );
}