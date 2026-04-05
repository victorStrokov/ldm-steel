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

  const selectedStorySlides = React.useMemo(() => {
    if (!selectedStory) {
      return [];
    }

    return selectedStory.items
      .map((item) => {
        const normalized = normalizeImageUrl(item.sourceUrl) ?? item.sourceUrl;
        if (!normalized) {
          return null;
        }

        const trimmed = normalized.trim();
        if (!trimmed) {
          return null;
        }

        if (trimmed.startsWith('/')) {
          return { url: trimmed };
        }

        try {
          const parsed = new URL(trimmed);
          // Avoid mixed-content failures in HTTPS by skipping insecure resources.
          if (parsed.protocol !== 'https:') {
            return null;
          }

          return { url: parsed.toString() };
        } catch {
          return null;
        }
      })
      .filter((slide): slide is { url: string } => slide !== null);
  }, [selectedStory]);

  React.useEffect(() => {
    async function fetchStories() {
      try {
        const data = await Api.stories.getAll();
        setStories(data);
      } catch {
        setStories([]);
      }
    }

    fetchStories();
  }, []);

  const onClickStory = (story: IStory) => {
    const hasPlayableSlide = story.items.some((item) => {
      const normalized = normalizeImageUrl(item.sourceUrl) ?? item.sourceUrl;
      if (!normalized) {
        return false;
      }

      const trimmed = normalized.trim();
      if (!trimmed) {
        return false;
      }

      if (trimmed.startsWith('/')) {
        return true;
      }

      try {
        const parsed = new URL(trimmed);
        return parsed.protocol === 'https:';
      } catch {
        return false;
      }
    });

    if (!hasPlayableSlide) {
      return;
    }

    setSelectedStory(story);
    setOpen(true);
  };
  return (
    <>
      <Container
        className={cn(
          'my-3 md:my-5',
          'overflow-x-auto',
          'flex items-center gap-1 md:gap-2',
          'flex-nowrap justify-start sm:justify-between',
          className,
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
            <div className="relative mx-auto max-h-150 w-full max-w-130">
              <button className="absolute right-5 top-5 z-30" onClick={() => setOpen(false)}>
                <X className="h-8 w-8 text-white/50" />
              </button>
              <ReactStories
                onAllStoriesEnd={() => setOpen(false)}
                stories={selectedStorySlides}
                defaultInterval={3000}
                preloadCount={0}
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
