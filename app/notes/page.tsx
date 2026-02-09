import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

const PER_PAGE = 12;

interface NotesPageProps {
  searchParams?: {
    searchText?: string;
    page: number;
  };
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const searchText = searchParams?.searchText ?? '';
  const page = searchParams?.page ?? 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', searchText, page],
    queryFn: () => fetchNotes(searchText, page, PER_PAGE),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient clientPage={page} clientSearchText={searchText} />
    </HydrationBoundary>
  );
}
