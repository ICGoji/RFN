import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse('Already purchased', { status: 400 });
    }

    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }

    const data = await db.purchase.create({
      data: {
        courseId: params.courseId,
        userId: userId,
      },
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.log('[COURSE_ID_CHECKOUT]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
