'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchPostById, fetchUserById } from '@/lib/api';
import css from './PostDetails.module.css';

export default function PostDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => fetchPostById(Number(id)),
    refetchOnMount: false,
  });

  const { data: user } = useQuery({
    queryKey: ['user', post?.userId],
    queryFn: () => fetchUserById(post!.userId),
    enabled: !!post, 
  });

  const handleClickBack = () => {
    router.back();
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  
  if (isError || !post) return <p>Something went wrong...</p>;

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

// 'use client';

// import { useParams, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';

// import { fetchPostById, fetchUserById } from '@/lib/api';

// import css from './PostDetails.module.css';
// import { User } from '@/types/user';

// export default function PostDetailsClient() {
//   const { id } = useParams<{ id: string }>();

//   const [user, setUser] = useState<User | null>(null);

//   const router = useRouter();

//   const handleClickBack = () => {
//     router.back();
//   };

//   const { data } = useQuery({
//     queryKey: ['post', id],
//     queryFn: () => fetchPostById(id),
//     refetchOnMount: false,
//   });

//   useEffect(() => {
//     if (!data) return;
//     const fn = async () => {
//       const response = await fetchUserById(data.userId);
//       setUser(response);
//     };
//     fn();
//   }, [data]);

//   return (
//     <>
//       <div className={css.container}>
//         <div className={css.item}>
//           <button onClick={handleClickBack} className={css.backBtn}>
//             ← Back
//           </button>

//           {data && (
//             <div className={css.post}>
//               <div className={css.wrapper}>
//                 <div className={css.header}>
//                   <h2>{data.title}</h2>
//                 </div>

//                 <p className={css.content}>{data.body}</p>
//               </div>
//               {user && <p className={css.user}>Author: {user.name}</p>}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }