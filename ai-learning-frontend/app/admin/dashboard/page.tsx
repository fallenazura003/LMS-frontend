'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import api from '@/lib/api';
import ProtectedRoute from "@/route/ProtectedRoute";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ Users: 0, Courses: 0, Enrollments: 0 });
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await api.get('/admin/dashboard');
                setStats(statsRes.data);

                const usersRes = await api.get('/admin/users');
                setUsers(usersRes.data);

                const coursesRes = await api.get('/admin/courses');
                setCourses(coursesRes.data);

                const logsRes = await api.get('/admin/logs');
                setLogs(logsRes.data);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
        <div className="p-6">
            <Tabs defaultValue="stats">
                <TabsList className="mb-4">
                    <TabsTrigger value="stats">Thống kê</TabsTrigger>
                    <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
                    <TabsTrigger value="courses">Quản lý khóa học</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="stats">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader><CardTitle>Người dùng</CardTitle></CardHeader>
                            <CardContent>{stats.Users}</CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Khóa học</CardTitle></CardHeader>
                            <CardContent>{stats.Courses}</CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Lượt mua</CardTitle></CardHeader>
                            <CardContent>{stats.Enrollments}</CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="users">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Vai trò</TableHead>
                                <TableHead>Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={user.status === 'ACTIVE'}
                                            onCheckedChange={() => {
                                                api.patch(`/admin/users/${user.id}/status`);
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="courses">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tiêu đề</TableHead>
                                <TableHead>Người tạo</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {courses.map((course: any) => (
                                <TableRow key={course.id}>
                                    <TableCell>{course.title}</TableCell>
                                    <TableCell>{course.creatorName}</TableCell>
                                    <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="logs">
                    <ul className="list-disc list-inside">
                        {logs.map((log: string, index: number) => (
                            <li key={index}>{log}</li>
                        ))}
                    </ul>
                </TabsContent>
            </Tabs>
        </div>
        </ProtectedRoute>
    );
}
