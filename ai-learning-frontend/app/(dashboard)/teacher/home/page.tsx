// app/teacher/courses/page.tsx (Ví dụ: Trang quản lý khóa học của giáo viên)
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AddNewCourseDialog from '@/components/course/AddNewCourseDialog'; // Đảm bảo đường dẫn đúng
import api from '@/lib/api'; // Sử dụng instance api đã cấu hình
import CourseCard from '@/components/course/CourseCard'; // Sử dụng CourseCard chung
import { useAuth } from '@/store/auth'; // Để lấy userRole

interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    creatorName: string;
    createdAt: string;
    visible: boolean;
    // Thêm các trường khác mà backend trả về
}

export default function TeacherCourseListPage() {
    const [courseList, setCourseList] = useState<Course[]>([]);
    const { role } = useAuth(); // Lấy vai trò của người dùng

    // Giả định API endpoint để lấy danh sách khóa học của giáo viên
    // `/teacher/courses` hoặc `/admin/courses`
    const GetCourseList = async () => {
        try {
            const endpoint = role === 'TEACHER' ? '/teacher/courses' : '/admin/courses'; // Tùy chỉnh endpoint
            const result = await api.get<Course[]>(endpoint);
            setCourseList(result.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách khóa học:", error);
            // Xử lý lỗi, ví dụ: hiển thị toast
        }
    };

    useEffect(() => {
        // Chỉ fetch khi role đã được xác định và là TEACHER/ADMIN
        if (role === 'TEACHER' || role === 'ADMIN') {
            GetCourseList();
        }
    }, [role]); // Phụ thuộc vào role để fetch lại khi role thay đổi

    return (
        <div className="mt-10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-3xl text-gray-800">Khóa học của bạn</h2>
                {role === 'TEACHER' && (
                    <AddNewCourseDialog onCourseCreated={GetCourseList}>
                        <Button>+ Tạo khóa học mới</Button>
                    </AddNewCourseDialog>
                )}
            </div>


            {courseList?.length === 0 ? (
                <div className="flex justify-center items-center p-7 flex-col border rounded-md mt-6 bg-secondary text-center">
                    <Image src="/certificate.jpg" alt="No Course" width={100} height={100} className="mb-4" />
                    <h2 className="text-xl font-bold my-2 text-gray-700">Bạn chưa có khóa học nào</h2>
                    {role === 'TEACHER' && (
                        <AddNewCourseDialog onCourseCreated={GetCourseList}>
                            <Button className="mt-4">+ Tạo khóa học mới</Button>
                        </AddNewCourseDialog>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courseList.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            // Ép kiểu role để khớp với định nghĩa của userRole trong CourseCardProps
                            userRole={role as 'STUDENT' | 'TEACHER' | 'ADMIN' | null | undefined}
                            onCourseActionSuccess={GetCourseList}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}