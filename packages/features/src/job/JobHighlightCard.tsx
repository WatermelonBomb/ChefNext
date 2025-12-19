import * as React from 'react';
import { Badge, Button, Card } from '@ui';
import { JobHighlightCardProps } from './types';

export const JobHighlightCard: React.FC<JobHighlightCardProps> = React.memo(({ job, onSelect }) => {
  return (
    <Card
      padding="lg"
      interactive
      className="flex flex-col gap-4 h-full"
      data-testid="job-highlight-card"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#8B7B5E] mb-1">{job.restaurantName}</p>
          <h3 className="text-xl font-semibold text-[#1C1C1C] mb-1">{job.headline}</h3>
          <p className="text-sm text-[#534022] flex items-center gap-1">
            <span role="img" aria-hidden>
              📍
            </span>
            {job.location}
          </p>
        </div>
        {job.featured && <Badge variant="warning">注目</Badge>}
      </div>

      {job.imageUrl && (
        <div className="rounded-2xl overflow-hidden h-40 w-full bg-[#F6F0E0]">
          <img
            src={job.imageUrl}
            alt={`${job.restaurantName} の求人イメージ`}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm text-[#1C1C1C]/80">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#8B7B5E]">報酬</span>
          <span className="text-lg font-semibold text-[#1C1C1C]">{job.salary}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#8B7B5E]">期間</span>
          <span className="text-base font-medium">{job.duration}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="bg-white">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-auto">
        <Button className="w-full" onClick={() => onSelect?.(job)}>
          詳細を見る
        </Button>
      </div>
    </Card>
  );
});
