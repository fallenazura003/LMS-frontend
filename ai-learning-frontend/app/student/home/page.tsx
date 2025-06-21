'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProtectedRoute from "@/route/ProtectedRoute";

export default function StudentHome() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        api.get('/student/courses') // 🔁 Đã sửa endpoint
            .then(res => setCourses(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <ProtectedRoute allowedRoles={["STUDENT"]}>
            <main className="p-6">
                <h1 className="text-2xl font-bold mb-4">Khóa học có thể học</h1>
                {courses.length === 0 ? (
                    <p>Không có khóa học nào khả dụng.</p>
                ) : (
                    <ul className="space-y-2">
                        {courses.map((course: any) => (
                            <li key={course.id} className="p-4 bg-gray-100 rounded shadow">
                                <h2 className="font-semibold">{course.title}</h2>
                                <p>{course.description}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </ProtectedRoute>
    );
}
