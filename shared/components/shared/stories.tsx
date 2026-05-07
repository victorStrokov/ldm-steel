'use client';

import { normalizeImageUrl } from '@/shared/lib/normalize-image-url';
import { Api } from '@/shared/services/api-client';
import { IStory } from '@/shared/services/stories';
import React from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { Container } from './container';
import { cn } from '@/shared/lib/utils';
import { Volume2, VolumeX, X } from 'lucide-react';
import ReactStories from 'react-insta-stories';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'swiper/css';

interface Props {
  className?: string;
}

function isVideoUrl(value: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(value);
}

export const Stories: React.FC<Props> = ({ className }) => {
  const [stories, setStories] = React.useState<IStory[]>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedStory, setSelectedStory] = React.useState<IStory>();
  const [isMuted, setIsMuted] = React.useState(false);
  const isMutedRef = React.useRef(false);
  const openedAtRef = React.useRef(0);

  const closeStories = React.useCallback(() => {
    setOpen(false);
    setSelectedStory(undefined);
  }, []);

  const buildSlides = React.useCallback((story: IStory) => {
    return story.items
      .map((item) => {
        const normalized = normalizeImageUrl(item.sourceUrl) ?? item.sourceUrl;
        if (!normalized) return null;
        const trimmed = normalized.trim();
        if (!trimmed) return null;

        const isVideo = isVideoUrl(trimmed);

        if (isVideo) {
          let videoUrl: string | null = trimmed;
          if (!trimmed.startsWith('/')) {
            try {
              const parsed = new URL(trimmed);
              if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
              videoUrl = parsed.toString();
            } catch {
              return null;
            }
          }
          if (!videoUrl) return null;

          const url = videoUrl;
          return {
            url,
            type: 'video' as const,
            duration: 120000,
            content: ({ action }: { action: (type: 'pause' | 'play' | 'next' | 'previous') => void }) => (
              <video
                src={url}
                className="h-full w-full bg-black object-contain"
                autoPlay
                muted
                playsInline
                controls={false}
                preload="metadata"
                onEnded={() => action('next')}
              />
            ),
          };
        }

        if (trimmed.startsWith('/')) return { url: trimmed };

        try {
          const parsed = new URL(trimmed);
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
          return { url: parsed.toString() };
        } catch {
          return null;
        }
      })
      .filter((slide): slide is NonNullable<typeof slide> => slide !== null);
  }, []);

  const selectedStorySlides = React.useMemo(() => {
    if (!selectedStory) return [];
    return buildSlides(selectedStory);
  }, [selectedStory, buildSlides]);

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

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeStories();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeStories]);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const onClickStory = (story: IStory) => {
    const slides = buildSlides(story);
    if (slides.length === 0) return;
    openedAtRef.current = Date.now();
    isMutedRef.current = false;
    setIsMuted(false);
    setSelectedStory(story);
    setOpen(true);
  };

  React.useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const videoEl = document.querySelector<HTMLVideoElement>('video');
      if (videoEl) videoEl.muted = false;
    }, 300);
    return () => clearTimeout(timer);
  }, [open]);

  const handleBackdropClick = React.useCallback(() => {
    if (Date.now() - openedAtRef.current < 300) return;
    closeStories();
  }, [closeStories]);

  const handleStoriesEnd = React.useCallback(() => {
    setTimeout(() => closeStories(), 0);
  }, [closeStories]);

  const isLoading = stories.length === 0;
  const storySlideWidthClass = 'w-[120px]! sm:w-[160px]! lg:w-[200px]!';
  const storyCardHeightClass = 'h-[180px] sm:h-[240px] lg:h-[300px]';

  return (
    <>
      <Container className={cn('my-3 md:my-5 overflow-hidden', className)}>
        {isLoading ? (
          <div className="flex gap-2 overflow-x-hidden sm:gap-3 lg:gap-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className={cn(
                  storySlideWidthClass,
                  storyCardHeightClass,
                  'shrink-0 animate-pulse rounded-2xl bg-gray-200',
                )}
              />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={8}
            breakpoints={{
              640: { spaceBetween: 12 },
              1024: { spaceBetween: 16 },
            }}
            slidesPerView="auto"
            loop={stories.length > 1}
            speed={3000}
            allowTouchMove={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
          >
            {stories.map((story, index) => (
              <SwiperSlide key={story?.id ?? index} className={storySlideWidthClass}>
                <div
                  className={cn(
                    storyCardHeightClass,
                    'relative w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl',
                  )}
                  onClick={() => onClickStory(story)}
                >
                  <Image
                    src={normalizeImageUrl(story.previewImageUrl) ?? '/no-image.png'}
                    alt="сторис"
                    fill
                    sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 200px"
                    quality={90}
                    draggable={false}
                    className="object-cover object-center"
                    priority={index < 4}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Container>

      {open &&
        selectedStorySlides.length > 0 &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={handleBackdropClick}
          >
            <div
              className="relative shrink-0"
              style={{ width: 'min(390px, 100vw)', height: 'min(692px, 100dvh)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <ReactStories
                onAllStoriesEnd={handleStoriesEnd}
                stories={selectedStorySlides}
                defaultInterval={3000}
                preloadCount={0}
                width="100%"
                height="100%"
              />

              {/* Кнопка звука */}
              <button
                type="button"
                className="absolute left-3 top-3 z-9999 rounded-full bg-black/45 p-2 text-white"
                onClick={() => {
                  const newMuted = !isMutedRef.current;
                  isMutedRef.current = newMuted;
                  setIsMuted(newMuted);
                  const videoEl = document.querySelector<HTMLVideoElement>('video');
                  if (videoEl) videoEl.muted = newMuted;
                }}
                aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              {/* Кнопка закрытия */}
              <button
                type="button"
                className="absolute right-3 top-3 z-9999 rounded-full bg-black/45 p-2 text-white"
                onClick={closeStories}
                aria-label="Закрыть сторис"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
