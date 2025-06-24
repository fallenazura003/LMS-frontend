'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';

interface AddNewCourseDialogProps {
    children: React.ReactNode;
    onCourseCreated?: () => void;
}

interface CourseFormData {
    title: string;
    description: string;
    price: number;
    imageFile?: FileList;
    imageUrl?: string;
}

export default function AddNewCourseDialog({ children, onCourseCreated }: AddNewCourseDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm<CourseFormData>();

    const onSubmit = async (data: CourseFormData) => {
        if (!data.imageFile?.length && !data.imageUrl?.trim()) {
            toast.error("Vui lòng cung cấp ảnh đại diện (tệp hoặc URL).");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());

        if (data.imageFile?.[0]) {
            formData.append('image', data.imageFile[0]);
        } else if (data.imageUrl?.trim()) {
            formData.append('imageUrl', data.imageUrl.trim());
        }

        try {
            const response = await api.post('/teacher/courses', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200 || response.status === 201) {
                toast.success("Khóa học đã được tạo thành công!");
                setOpen(false);
                reset(); // reset form
                onCourseCreated?.();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo khóa học.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tạo khóa học mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin khóa học và chọn ảnh đại diện (upload hoặc URL).
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input id="title" {...register('title', { required: true })} />
                        {errors.title && <span className="text-red-500 text-sm">Tiêu đề là bắt buộc</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea id="description" {...register('description', { required: true })} />
                        {errors.description && <span className="text-red-500 text-sm">Mô tả là bắt buộc</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="price">Giá (VNĐ)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="1000"
                            min="0"
                            {...register('price', { required: true, min: 0 })}
                        />
                        {errors.price && <span className="text-red-500 text-sm">Giá không hợp lệ</span>}
                    </div>

                    <div className="grid gap-2">
                        <Label>Ảnh đại diện</Label>
                        <Input id="imageFile" type="file" accept="image/*" {...register('imageFile')} />
                        <span className="text-sm text-muted-foreground text-center">hoặc</span>
                        <Input type="text" placeholder="https://example.com/image.jpg" {...register('imageUrl')} />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Đang tạo...' : 'Tạo khóa học'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
