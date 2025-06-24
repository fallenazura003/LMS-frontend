// app/admin/courses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image'; // Import Next.js Image component

interface Course {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    creatorName: string;
    createdAt: string;
    visible: boolean;
}

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);

    const fetchCourses = async () => {
        try {
            const res = await api.get<Course[]>('/admin/courses');
            setCourses(res.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách khóa học:', error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const toggleCourseVisibility = async (courseId: string, currentVisible: boolean) => {
        const confirmChange = window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái hiển thị của khóa học này không?');
        if (!confirmChange) return;
        try {
            await api.put(`/admin/courses/${courseId}/visibility`, {
                visible: !currentVisible,
            });
            await fetchCourses(); // Refresh data
        } catch (err) {
            console.error('Lỗi khi thay đổi trạng thái hiển thị khóa học:', err);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý khóa học</h1>
            <Table className="bg-white shadow-md rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead>Ảnh</TableHead>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Người tạo</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Hiển thị</TableHead>
                        <TableHead>Mô tả</TableHead> {/* Thêm cột mô tả nếu muốn */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses.map((course) => (
                        <TableRow key={course.id}>
                            <TableCell>
                                {course.imageUrl && (
                                    <div className="relative w-20 h-12 overflow-hidden rounded-md">
                                        {course.imageUrl.startsWith('/uploads/') ? (
                                            <Image
                                                src={`http://localhost:8080${course.imageUrl}`}
                                                alt={course.title}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-md"
                                            />
                                        ) : (
                                            <Image
                                                src={course.imageUrl}
                                                alt={course.title}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-md"
                                            />
                                        )}
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell>{course.creatorName}</TableCell>
                            <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={course.visible}
                                    onCheckedChange={() => toggleCourseVisibility(course.id, course.visible)}
                                    aria-label={`Toggle visibility for ${course.title}`}
                                />
                                <span className="ml-2 text-sm text-gray-500">
                                    {course.visible ? 'Hiển thị' : 'Ẩn'}
                                </span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{course.description.substring(0, 50)}...</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}