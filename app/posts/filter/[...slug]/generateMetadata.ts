import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const userId = slug[0] ?? "All";

  return {
    title: userId === "All" ? "Posts - All Users" : `Posts - User ${userId}`,
  };
}