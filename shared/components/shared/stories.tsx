'use client';

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
      <Container className={cn('flex items-center justify-between gap-2 my-5', className)}>
        {stories.length === 0 &&
          [...Array(9)].map((_, index) => (
            <div key={index} className="w-[120px] h-[170px] bg-gray-200 animate-pulse rounded-md"></div>
          ))}
        {stories.map((story) => (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            key={story.id}
            onClick={() => onClickStory(story)}
            className="rounded-md cursor-pointer"
            height={170}
            width={120}
            src={story.previewImageUrl}
          />
        ))}

        {open && (
          <div className="absolute left-0 top-0 w-full h-full bg-black/80 flex items-center z-30 ">
            <div className="relative  " style={{ width: 520 }}>
              <button className="absolute r-10  top-5 z-30" onClick={() => setOpen(false)}>
                <X className="relative right-0 top-0 w-8 h-8 text-white/50" />
              </button>
            </div>
            <ReactStories
              onAllStoriesEnd={() => setOpen(false)}
              stories={
                selectedStory?.items.map((item) => ({
                  url: item.sourceUrl,
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
