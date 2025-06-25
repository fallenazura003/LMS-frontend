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
    const [purchasedCourses, setPurchasedCourses] = useState<Course[]>([]);
    const [exploreCourses, setExploreCourses] = useState<Course[]>([]);
    const { role } = useAuth();

    const getCourses = async () => {
        try {
            const res1 = await api.get<Course[]>('/student/courses'); // đã mua
            setPurchasedCourses(res1.data);
            const res2 = await api.get<Course[]>('/student/explore'); // visible chưa mua
            setExploreCourses(res2.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khóa học:", error);
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

            {purchasedCourses.length > 0 && (
                <div className="mt-10">
                    <h2 className="font-bold text-2xl mb-4">Khóa học của bạn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {purchasedCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isEnrolled={true}
                                userRole={role as 'STUDENT'}
                            />
                        ))}
                    </div>
                </div>
            )}

            {exploreCourses.length > 0 && (
                <div className="mt-12">
                    <h2 className="font-bold text-2xl mb-4">Khám phá khóa học</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {exploreCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isEnrolled={false}
                                userRole={role as 'STUDENT'}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
