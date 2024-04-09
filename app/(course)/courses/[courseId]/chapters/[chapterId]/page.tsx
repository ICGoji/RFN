'use client';

import { redirect } from 'next/navigation';

import { getChapter } from '@/actions/get-chapter';
import { Banner } from '@/components/banner';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/preview';
import { useEffect, useState } from 'react';

import { VideoPlayer } from './_components/video-player';
import { CourseEnrollButton } from './_components/course-enroll-button';
import { CourseProgressButton } from './_components/course-progress-button';
import axios from 'axios';

const ChapterIdPage = ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const [isLocked, setIsLocked] = useState(true);
  const [chapter, setChapter] = useState<{
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    position: number;
    isPublished: boolean;
    isFree: boolean;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null>(null);
  const [course, setCourse] = useState<{ price: number | null } | null>(null);
  const [muxData, setMuxData] = useState<{
    id: string;
    assetId: string;
    playbackId: string | null;
    chapterId: string;
  } | null>(null);
  const [nextChapter, setNextChapter] = useState<{
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    position: number;
    isPublished: boolean;
    isFree: boolean;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null>(null);
  const [purchase, setPurchase] = useState<{
    id: string;
    userId: string;
    courseId: string;
    createdAt: Date;
    updatedAt: Date;
  } | null>(null);

  const [completeOnEnd, setCompleteOnEnd] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await axios.post(`/api/dashboard/chapters`, {
          userId,
          chapterId: params.chapterId,
          courseId: params.courseId,
        });
        // userId,
        // chapterId: params.chapterId,
        // courseId: params.courseId,
        const {
          chapter: fetchedChapter,
          course: fetchedCourse,
          muxData: fetchedMuxData,
          nextChapter: fetchedNextChapter,
          purchase: fetchedPurchase,
        } = response.data;

        if (!fetchedChapter || !fetchedCourse) {
          return redirect('/');
        }
        setIsLocked(!fetchedChapter.isFree && !fetchedPurchase);
        setChapter(fetchedChapter);
        setCourse(fetchedCourse);
        setMuxData(fetchedMuxData);
        setNextChapter(fetchedNextChapter);
        setPurchase(fetchedPurchase);

        // const isLocked = !chapter.isFree && !purchase;
        // setIsLocked(isLocked);
        setCompleteOnEnd(!!fetchedPurchase);
      }
    }
    fetchData();
  }, [params.chapterId, params.courseId]);

  return (
    <div>
      {isLocked && (
        <Banner
          variant='warning'
          label='You need to purchase this video first.'
        />
      )}
      <div className='flex flex-col max-w-4xl mx-auto pb-20'>
        <div className='p-4'>
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter ? chapter.title : ''}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className='p-4 flex flex-col md:flex-row items-center justify-between'>
            <h2 className='text-2xl font-semibold mb-2'>
              {chapter ? chapter.title : ''}
            </h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
              />
            ) : (
              course && (
                <CourseEnrollButton
                  courseId={params.courseId}
                  price={course.price!}
                />
              )
            )}
          </div>
          <Separator />
          <div>
            {chapter && chapter.description && (
              <Preview value={chapter.description} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
