'use client';

import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';
import { Api } from '@/shared/services/api-client';
import { IStory } from '@/shared/services/stories';
import React from 'react';
import { Container } from './container';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';
import ReactStories from 'react-insta-stories';

interface Props {
  className?: string;
}

export const Stories: React.FC<Props> = ({ className }) => {
  const [stories, setStories] = React.useState<IStory[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedStory, setSelectedStory] = React.useState<IStory>();

  React.useEffect(() => {
    async function fetchStories() {
      const data = await Api.stories.getAll();
      setStories(data);
    }

    fetchStories();
  }, []);

  const onClickStory = (story: IStory) => {
    setSelectedStory(story);
    if (story.items.length > 0) {
      setOpen(true);
    }
  };
  return (
    <>
      <Container className={cn('my-5 flex items-center justify-between gap-2', className)}>
        {stories.length === 0 &&
          [...Array(9)].map((_, index) => (
            <div key={index} className="h-[170px] w-[120px] animate-pulse rounded-md bg-gray-200"></div>
          ))}
        {stories.map((story) => (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            key={story.id}
            onClick={() => onClickStory(story)}
            className="cursor-pointer rounded-md"
            height={170}
            width={120}
            src={normalizeImageUrl(story.previewImageUrl)}
          />
        ))}

        {open && (
          <div className="absolute top-0 left-0 z-30 flex h-full w-full items-center bg-black/80">
            <div className="relative" style={{ width: 520 }}>
              <button className="r-10 absolute top-5 z-30" onClick={() => setOpen(false)}>
                <X className="relative top-0 right-0 h-8 w-8 text-white/50" />
              </button>
            </div>
            <ReactStories
              onAllStoriesEnd={() => setOpen(false)}
              stories={
                selectedStory?.items.map((item) => ({
                  url: normalizeImageUrl(item.sourceUrl) ?? item.sourceUrl,
                })) || []
              }
              defaultInterval={3000}
              width={420}
              height={600}
            />
          </div>
        )}
      </Container>
    </>
  );
};
