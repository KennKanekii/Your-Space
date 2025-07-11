'use client'

import { useQuery } from 'convex/react'
import { BoardCard } from './board-card'
import { EmptySearch } from './empty-search'
import { EmptyBoards } from './empty-board'
import { EmptyFavorites } from './empty-favourite'
import { NewBoardButton } from './new-board-button'
import { api } from '@/convex/_generated/api'

interface BoardListProps {
  orgId: string
  query: {
    search?: string
    favorites?: string
  }
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = useQuery(api.boards.get, {
    orgId,
    ...query,
  });

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-3xl ">
          {query.favorites ? `Favorite boards` : `Team boards`}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6  gap-5 mt-8 pb-10">
          <NewBoardButton orgId={orgId} disabled={true} />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );
  }

  if (!data?.length && query.search) {
    return <EmptySearch />
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorites />
  }

  if (!data?.length) {
    return <EmptyBoards />
  }

  return (
    <div>
      <h2 className="text-3xl ">
        {query.favorites ? `Favorite boards` : `Team boards`}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6  gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} disabled={false} />
        {data.map((board) => (
          <BoardCard
            key={board._id}
            id={board._id}
            title={board.title}
            imageUrl={board.imageUrl}
            orgId={board.orgId}
            authorId={board.authorId}
            authorName={board.authorName}
            createdAt={board._creationTime}
            isFavorite={board.isFavorite}
          />
        ))}
      </div>
    </div>
  );
}