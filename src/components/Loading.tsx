import React from 'react'
import { Skeleton } from './ui/skeleton';

const Loading = () => {
  return (
    <div className="p-4 space-y-2">
      {[...Array(10)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-md" />
      ))}
    </div>
  );
}

export default Loading