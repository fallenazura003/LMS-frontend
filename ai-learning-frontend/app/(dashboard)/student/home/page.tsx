'use client';

import React, { useEffect, useState } from 'react';
import WelcomeBanner from '@/components/course/WelcomeBanner';
import CourseCard from '@/components/course/CourseCard';
import api from '@/lib/api';
import { useAuth } from '@/store/auth';

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    creatorName: string;
    createdAt: string;
    visible: boolean;
}

export default function StudentHomePage() {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const { role } = useAuth();

    const getCourses = async () => {
        try {
            const result = await api.get<Course[]>('/student/courses');
            console.log("Danh sách khóa học đã mua:", result.data);
            setCourseList(result.data);
        } catch (error) {
            console.error("Lỗi khi tải khóa học:", error);
        }
    };

    useEffect(() => {
        if (role === 'STUDENT') {
            getCourses();
        }
    }, [role]);

    return (
        <div className="p-6">
            <WelcomeBanner />

            {courseList.length > 0 && (
                <div className="mt-10">
                    <h2 className="font-bold text-2xl mb-4">Khóa học của bạn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courseList.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isEnrolled={true}
                                userRole={role as 'STUDENT' | 'TEACHER' | 'ADMIN' | null | undefined}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
