'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import Image from 'next/image';
import { DollarSign } from 'lucide-react';
import { useAuth } from '@/store/auth';

interface CourseDetail {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    creatorName: string;
    price: number;
    createdAt: string;
    visible: boolean;
}

export default function StudentCourseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { role } = useAuth();

    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/student/courses/${id}`);
                setCourse(res.data);
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Không thể tải khóa học');
            } finally {
                setLoading(false);
            }
        };

        const checkPurchased = async () => {
            try {
                const purchasedRes = await api.get(`/student/courses`);
                const purchased = purchasedRes.data as CourseDetail[];
                const purchasedIds = purchased.map((c) => c.id);
                setHasPurchased(purchasedIds.includes(id as string));
            } catch (e) {
                console.warn('Không thể kiểm tra trạng thái mua');
            }
        };

        if (role === 'STUDENT') {
            fetchCourse();
            checkPurchased();
        }
    }, [id, role]);

    const handleBuy = async () => {
        if (!course) return;
        setBuying(true);
        try {
            await api.post('/student/purchase', { courseId: course.id });
            toast.success('Đã mua khóa học thành công!');
            setHasPurchased(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Mua khóa học thất bại');
        } finally {
            setBuying(false);
        }
    };

    const getFullImageUrl = (path: string | undefined | null) => {
        if (!path || path.trim() === '') {
            return 'https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png';
        }
        if (path.startsWith('/uploads/')) {
            return `http://localhost:8080${path}`;
        }
        return path;
    };

    if (loading) return <div className="p-6 text-center">Đang tải...</div>;
    if (!course) return <div className="p-6 text-center">Không tìm thấy khóa học.</div>;

    return (

        <div className="p-6 max-w-6xl mx-auto">
            {/* Tiêu đề và nút mua */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
                    <p className="text-gray-600 mt-2">Tác giả: {course.creatorName}</p>
                </div>

                {!hasPurchased && (
                    <Button
                        onClick={handleBuy}
                        disabled={buying}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <DollarSign className="mr-2 w-5 h-5" />
                        {buying ? 'Đang xử lý...' : 'Mua khóa học'}
                    </Button>
                )}
            </div>

            {/* Ảnh */}
            <div className="relative w-full h-[300px] rounded overflow-hidden mb-6">
                <Image
                    src={getFullImageUrl(course.imageUrl)}
                    alt={course.title}
                    fill
                    className="object-cover rounded"
                />
            </div>

            {/* Giá và mô tả */}
            <div className="mb-6 text-xl text-green-600 font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {course.price === 0 ? 'Miễn phí' : `${course.price} VNĐ`}
            </div>

            <p className="text-gray-700 whitespace-pre-line">{course.description}</p>
        </div>
    );
}
