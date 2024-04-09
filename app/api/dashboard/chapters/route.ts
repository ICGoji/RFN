import { NextResponse } from 'next/server';

import { Chapter } from '@prisma/client';

import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId, courseId, chapterId } = await req.json();
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) {
      throw new Error('Chapter or course not found');
    }

    let muxData = null;
    let nextChapter: Chapter | null = null;

    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        },
      });

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: 'asc',
        },
      });
    }

    return NextResponse.json({
      chapter,
      course,
      muxData,
      nextChapter,
      purchase,
    });
  } catch (error) {
    console.log('[GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
