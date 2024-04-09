import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    // if (!userId) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    console.log(purchasedCourses);
    return NextResponse.json(purchasedCourses);
  } catch (error) {
    console.log('[GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
