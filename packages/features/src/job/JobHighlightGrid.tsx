import * as React from 'react';
import { JobHighlightGridProps } from './types';
import { JobHighlightCard } from './JobHighlightCard';

export const JobHighlightGrid: React.FC<JobHighlightGridProps> = ({ jobs, onSelect, actionLabel, columns = 3 }) => {
  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E4DCC3] bg-[#FAF8F4] p-10 text-center text-[#8B7B5E]">
        表示できる求人がまだありません。
      </div>
    );
  }

  const columnClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  }[columns];

  return (
    <section className="space-y-6">
      {actionLabel && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#8B7B5E] uppercase tracking-wide">求人ピックアップ</p>
            <h2 className="text-2xl font-semibold text-[#1C1C1C]">今週の注目ポジション</h2>
          </div>
          <span className="text-sm text-[#CDAE58]">{actionLabel}</span>
        </div>
      )}
      <div className={`grid gap-6 ${columnClass}`}>
        {jobs.map((job) => (
          <JobHighlightCard key={job.id} job={job} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
};
