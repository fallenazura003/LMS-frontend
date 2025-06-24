'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api'; // Đảm bảo đường dẫn này đúng
import ProtectedRoute from "@/route/ProtectedRoute"; // Đảm bảo đường dẫn này đúng
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image'; // Import Next.js Image component

// Define a type for your form state
interface CourseForm {
    title: string;
    description: string;
    price: string; // Keep as string for input, convert to number later if needed
    imageFile: File | null; // For file uploads
    imageUrl: string;      // For external image URLs
}

// Define a type for your course data received from backend
interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string | null;
    creatorName: string;
    createdAt: string;
    updatedAt: string;
}

export default function TeacherHome() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [form, setForm] = useState<CourseForm>({
        title: '',
        description: '',
        price: '',
        imageFile: null,
        imageUrl: '',
    });

    const fetchCourses = async () => {
        try {
            const res = await api.get<Course[]>('/teacher/courses');
            setCourses(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách khóa học:", err);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;

        if (name === 'imageFile') {
            // If user selects a file, clear the imageUrl field
            setForm((prevForm) => ({ ...prevForm, imageFile: files?.[0] || null, imageUrl: '' }));
        } else if (name === 'imageUrl') {
            // If user types an URL, clear the imageFile field
            setForm((prevForm) => ({ ...prevForm, imageUrl: value, imageFile: null }));
        } else {
            setForm((prevForm) => ({ ...prevForm, [name]: value }));
        }
    };

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        formData.append('price', form.price.toString()); // Ensure price is a string for FormData

        if (form.imageFile) {
            formData.append('image', form.imageFile); // 'image' must match @RequestPart("image") in backend
        } else if (form.imageUrl && form.imageUrl.trim() !== '') {
            formData.append('imageUrl', form.imageUrl); // 'imageUrl' must match @RequestPart("imageUrl") in backend
        }

        try {
            console.log("Sending FormData:", Object.fromEntries(formData.entries())); // For debugging
            await api.post("/teacher/courses", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Necessary for FormData
                }
            });

            setOpenCreate(false);
            setForm({ title: '', description: '', price: '', imageFile: null, imageUrl: '' }); // Reset form
            await fetchCourses(); // Refresh course list
            alert("Tạo khóa học thành công!");
        } catch (err) {
            console.error('Lỗi tạo khóa học:', err);
            alert("Lỗi tạo khóa học: " + (err instanceof Error ? err.message : "Unknown error"));
        }
    };

    return (
        <ProtectedRoute allowedRoles={["TEACHER"]}>
            <main className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Khóa học bạn đã tạo</h1>
                    <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                        <DialogTrigger asChild>
                            <Button>Tạo khóa học</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle>Tạo khóa học thủ công</DialogTitle>
                            <DialogDescription>Nhập thông tin khóa học và chọn ảnh đại diện hoặc dán URL.</DialogDescription>
                            <form onSubmit={handleCreateCourse} className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Tiêu đề</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description">Mô tả</Label>
                                    <Input
                                        id="description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="price">Giá</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        value={form.price}
                                        onChange={handleChange}
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="imageFile">Upload ảnh</Label>
                                    <Input
                                        id="imageFile"
                                        name="imageFile"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                        disabled={!!form.imageUrl} // Disable if imageUrl is present
                                    />
                                </div>
                                <div className="text-center my-2">Hoặc</div>
                                <div>
                                    <Label htmlFor="imageUrl">URL ảnh</Label>
                                    <Input
                                        id="imageUrl"
                                        name="imageUrl"
                                        type="text"
                                        value={form.imageUrl}
                                        onChange={handleChange}
                                        placeholder="Dán URL ảnh vào đây"
                                        disabled={!!form.imageFile} // Disable if imageFile is present
                                    />
                                </div>
                                <Button type="submit" className="w-full">Tạo khóa học</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {courses.length === 0 ? (
                    <p>Bạn chưa tạo khóa học nào.</p>
                ) : (
                    <ul className="space-y-4">
                        {courses.map((course) => (
                            <li key={course.id} className="p-4 bg-blue-100 rounded shadow flex items-center gap-4">
                                {course.imageUrl && (
                                    <div className="relative h-20 w-20">
                                        {course.imageUrl.startsWith('/uploads/') ? (
                                            // Image from your backend (local server)
                                            <Image
                                                src={`http://localhost:8080${course.imageUrl}`}
                                                alt={course.title}
                                                layout="fill" // Use layout="fill" with parent div for better control
                                                objectFit="cover"
                                                className="rounded"
                                            />
                                        ) : (
                                            // Image from external URL
                                            <Image
                                                src={course.imageUrl}
                                                alt={course.title}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded"
                                            />
                                        )}
                                    </div>
                                )}
                                {!course.imageUrl && (
                                    <div className="h-20 w-20 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                                        No Image
                                    </div>
                                )}
                                <div>
                                    <h2 className="font-semibold text-lg">{course.title}</h2>
                                    <p>{course.description}</p>
                                    <p>Giá: {course.price}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </ProtectedRoute>
    );
}