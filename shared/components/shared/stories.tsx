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
      <Container
        className={cn(
          'my-3 md:my-5',
          'overflow-x-auto',
          'flex items-center gap-1 md:gap-2',
          'flex-nowrap justify-start sm:justify-between',
          className
        )}
      >
        {stories.length === 0 &&
          [...Array(9)].map((_, index) => (
            <div key={index} className="h-30 w-20 md:h-44 md:w-30 animate-pulse rounded-md bg-gray-200"></div>
          ))}
        {stories.map((story) => (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            key={story.id}
            onClick={() => onClickStory(story)}
            className="cursor-pointer rounded-md shrink-0"
            height={120}
            width={80}
            src={normalizeImageUrl(story.previewImageUrl)}
            style={{ height: '120px', width: '80px' }}
            // на десктопе увеличим через md: классы
          />
        ))}

        {open && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 px-2">
            <div className="relative w-full max-w-130 mx-auto max-h-150">
              <button className="r-10 absolute top-5 right-5 z-30" onClick={() => setOpen(false)}>
                <X className="h-8 w-8 text-white/50" />
              </button>
              <ReactStories
                onAllStoriesEnd={() => setOpen(false)}
                stories={
                  selectedStory?.items.map((item) => ({
                    url: normalizeImageUrl(item.sourceUrl) ?? item.sourceUrl,
                  })) || []
                }
                defaultInterval={3000}
                width={'100%'}
                height={600}
              />
            </div>
          </div>
        )}
      </Container>
    </>
  );
};
