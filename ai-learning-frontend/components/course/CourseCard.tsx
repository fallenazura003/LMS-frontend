'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Book, LoaderCircle, PlayCircle, Settings, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';

interface CourseProps {
    course: {
        id: string;
        title: string;
        description: string;
        price: number;
        imageUrl: string;
        creatorName: string;
        createdAt: string;
        visible: boolean;
    };
    isEnrolled?: boolean;
    userRole?: 'STUDENT' | 'TEACHER' | 'ADMIN' | null;
    onCourseActionSuccess?: () => void;
}

export default function CourseCard({ course, isEnrolled, userRole, onCourseActionSuccess }: CourseProps) {
    const [loading, setLoading] = useState(false);

    const getFullImageUrl = (path: string | undefined | null) => {
        if (!path || path.trim() === "") {
            return "https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png";
        }
        if (path.startsWith('/uploads/')) {
            return `http://localhost:8080${path}`;
        }
        return path;
    };

    return (
        <div className="shadow-lg rounded-xl overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="relative w-full h-[200px]">
                <Image
                    src={getFullImageUrl(course?.imageUrl)}
                    alt={course?.title || 'Course Image'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="rounded-t-xl object-cover"
                />
            </div>

            <div className="p-4 flex flex-col gap-3">
                <h2 className="font-bold text-xl text-gray-800 line-clamp-2" title={course?.title}>
                    {course?.title}
                </h2>
                <p className="line-clamp-3 text-gray-600 text-sm">{course?.description}</p>

                <div className="flex items-center justify-between text-gray-700">
                    <h2 className="flex items-center gap-2">
                        <Book className="text-primary h-5 w-5" />
                        Số bài học: N/A
                    </h2>
                    <h2 className="flex items-center gap-2 text-green-600 font-semibold">
                        <DollarSign className="h-5 w-5" />
                        {course.price === 0 ? 'Miễn phí' : `${course.price} VNĐ`}
                    </h2>
                </div>

                <div className="mt-4">
                    {userRole === 'STUDENT' && (
                        isEnrolled ? (
                            <Link href={`/student/courses/${course.id}`} passHref>
                                <Button className="w-full" variant="secondary">
                                    <PlayCircle className="mr-2 h-5 w-5" /> Tiếp tục học
                                </Button>
                            </Link>
                        ) : (
                            <Link href={`/student/courses/${course.id}`} passHref>
                                <Button className="w-full">
                                    <PlayCircle className="mr-2 h-5 w-5" /> Xem chi tiết
                                </Button>
                            </Link>
                        )
                    )}

                    {userRole === 'TEACHER' && (
                        <Link href={`/ai-learning-frontend/app/(dashboard)/teacher/courses/${course.id}/edit`} passHref>
                            <Button className="w-full" variant="outline">
                                <Settings className="mr-2 h-5 w-5" /> Quản lý khóa học
                            </Button>
                        </Link>
                    )}

                    {userRole === 'ADMIN' && (
                        <Link href={`/admin/courses/${course.id}/edit`} passHref>
                            <Button className="w-full" variant="outline">
                                <Settings className="mr-2 h-5 w-5" /> Chỉnh sửa khóa học
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
