'use client';

import css from './NotesPage.module.css';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { fetchNotes, FetchNotesResponse } from '@/lib/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const PER_PAGE = 12;

interface NotesClientProps {
  clientSearchText: string;
  clientPage: number;
}

export default function NotesClient({
  clientSearchText,
  clientPage,
}: NotesClientProps) {
  const [searchText, setSearchText] = useState(clientSearchText);
  const [page, setPage] = useState(clientPage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', searchText, page],
    queryFn: () => fetchNotes(searchText, page, PER_PAGE),
    refetchOnMount: false,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    throwOnError: true,
  });

  const debounceSearchText = useDebouncedCallback((text: string) => {
    setSearchText(text);
    setPage(1);
  }, 300);

  return (
    <main className={css.main}>
      <div className={css.note}>
        <div className={css.toolbar}>
          <SearchBox text={searchText} onSearch={debounceSearchText} />
          {data && data.totalPages > 1 && (
            <Pagination
              totalPages={data.totalPages}
              page={page}
              onPageChange={setPage}
            />
          )}
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        </div>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      </div>
    </main>
  );
}
