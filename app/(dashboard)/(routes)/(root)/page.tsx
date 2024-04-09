'use client';
import { redirect } from 'next/navigation';
import { CheckCircle, Clock } from 'lucide-react';

import { CoursesList } from '@/components/courses-list';

import { InfoCard } from './_components/info-card';
import { useEffect, useId, useState } from 'react';

import { userIdStore } from '@/hooks/userId-store';
import axios from 'axios';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (userId) {
          console.log('userId:' + userId);

          const response = await axios.post(`/api/dashboard`, {
            userId: userId,
          });
          console.log(response.data);

          const transformedCourses = response.data.map((course) => ({
            ...course.course,
            category: course.course.category,
            chapters: course.course.chapters,
          }));

          setCourses(transformedCourses);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='p-6 space-y-4'>
      {loading ? (
        <div className='flex justify-center items-center'>Loading...</div>
      ) : (
        <CoursesList items={[...courses]} />
      )}
    </div>
  );
}
