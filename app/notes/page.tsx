import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

const PER_PAGE = 12;

interface NotesPageProps {
  searchText: string;
  page: number;
}

export default async function NotesPage({ searchText, page }: NotesPageProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', searchText, page],
    queryFn: () => fetchNotes(searchText, page, PER_PAGE),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
