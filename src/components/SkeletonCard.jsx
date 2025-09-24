import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white/5 rounded-xl overflow-hidden animate-pulse">
      <div className="bg-white/10 w-full h-64"></div>
      <div className="p-4">
        <div className="h-6 bg-white/10 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-5 bg-white/10 rounded-full w-16"></div>
          <div className="h-5 bg-white/10 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};