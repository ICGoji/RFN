import { Chapter, Course, UserProgress } from '@prisma/client';

import { NavbarRoutes } from '@/components/navbar-routes';

import { CourseMobileSidebar } from './course-mobile-sidebar';

interface CourseNavbarProps {
  course: Course & {
    chapters: Chapter[];
  };
}

export const CourseNavbar = ({ course }: CourseNavbarProps) => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
      <CourseMobileSidebar course={course} />
      <NavbarRoutes />
    </div>
  );
};
