
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Book, LoaderCircle, PlayCircle, Settings, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import api from '@/lib/api'; // Sử dụng axios instance đã cấu hình
import { toast } from 'sonner';

interface CourseProps {
    course: {
        id: string; // ID của khóa học
        title: string;
        description: string;
        price: number;
        imageUrl: string;
        creatorName: string;
        createdAt: string;
        visible: boolean;
        // Các trường khác có thể có từ backend
        // noOfChapters?: number; // Giả sử backend có thể trả về số chương
    };
    isEnrolled?: boolean; // Chỉ dùng cho Student
    userRole?: 'STUDENT' | 'TEACHER' | 'ADMIN' | null;
    onCourseActionSuccess?: () => void; // Callback khi hành động thành công (vd: enroll) để refresh danh sách
}

export default function CourseCard({ course, isEnrolled, userRole, onCourseActionSuccess }: CourseProps) {
    const [loading, setLoading] = useState(false);

    const onEnrollCourse = async () => {
        try {
            setLoading(true);
            const result = await api.post('/student/enrollments', { // Cập nhật endpoint nếu cần
                courseId: course.id
            });

            if (result.status === 200 || result.status === 201) {
                toast.success('Đăng ký khóa học thành công!');
                onCourseActionSuccess?.(); // Gọi callback để refresh danh sách hoặc cập nhật UI
            } else {
                toast.warning(result.data?.message || 'Đã có lỗi xảy ra!');
            }
        } catch (e: any) {
            console.error('Lỗi khi đăng ký khóa học:', e);
            toast.error(e.response?.data?.message || 'Đăng ký khóa học thất bại. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const getFullImageUrl = (path: string | undefined | null) => {
        if (!path || path.trim() === "") {
            // Ảnh mặc định từ ngoài nếu không có ảnh
            return "https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png";
        }
        if (path.startsWith('/uploads/')) {
            return `http://localhost:8080${path}`;
        }
        return path; // external URL
    };


    return (
        <div className="shadow-lg rounded-xl overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="relative w-full h-[200px]">
                <Image
                    src={getFullImageUrl(course?.imageUrl)}
                    alt={course?.title || 'Course Image'}
                    fill={true} // Thay thế layout="fill" bằng fill={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Thêm sizes để tối ưu hóa
                    priority // Tối ưu hóa tải ảnh đầu tiên nếu cần
                    className="rounded-t-xl object-cover" // Thêm object-cover để đảm bảo ảnh không bị méo
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
                        {/* noOfChapters cần được backend trả về hoặc tính toán. Tạm thời dùng placeholder */}
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
                            <Link href={`/ai-learning-frontend/app/(dashboard)/student/courses/${course.id}`} passHref>
                                <Button className="w-full" variant="secondary">
                                    <PlayCircle className="mr-2 h-5 w-5" /> Tiếp tục học
                                </Button>
                            </Link>
                        ) : (
                            <Button className="w-full" onClick={onEnrollCourse} disabled={loading}>
                                {loading ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />} Đăng ký học
                            </Button>
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