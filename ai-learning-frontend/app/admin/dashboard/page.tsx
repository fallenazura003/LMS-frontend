'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ProtectedRoute from "@/route/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ Users: 0, Courses: 0, Enrollments: 0 });
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [logs, setLogs] = useState([]);
    const [open, setOpen] = useState(false);
    const [editUser, setEditUser] = useState<any | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });

    const fetchAll = async () => {
        try {
            const [statsRes, usersRes, coursesRes, logsRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/users'),
                api.get('/admin/courses'),
                api.get('/admin/logs'),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);
            setCourses(coursesRes.data);
            setLogs(logsRes.data);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleFormSubmit = async () => {
        try {
            if (editUser) {
                await api.put(`/admin/users/${editUser.id}`, formData);
            } else {
                await api.post('/admin/users', formData);
            }
            await fetchAll();
            setOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'STUDENT' });
            setEditUser(null);
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: string) => {
        const confirm = window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái người dùng này không?');
        if (!confirm) return;
        try {
            await api.patch(`/admin/users/${userId}/status`, {
                status: currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
            });
            await fetchAll();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleCourseVisibility = async (courseId: string, currentVisible: boolean) => {
        const confirm = window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái hiển thị của khóa học?');
        if (!confirm) return;
        try {
            await api.put(`/admin/courses/${courseId}/visibility`, {
                visible: !currentVisible,
            });
            await fetchAll();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
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
                        <div className="mb-4 text-right">
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button>Tạo người dùng</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>{editUser ? 'Sửa người dùng' : 'Tạo người dùng'}</DialogTitle>
                                    <DialogDescription>Nhập thông tin người dùng.</DialogDescription>
                                    <div className="space-y-2">
                                        <Label>Tên</Label>
                                        <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        <Label>Email</Label>
                                        <Input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                        <Label>Mật khẩu</Label>
                                        <Input value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                        <Label>Vai trò</Label>
                                        <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-2 border rounded">
                                            <option value="STUDENT">Học viên</option>
                                            <option value="TEACHER">Giáo viên</option>
                                        </select>
                                    </div>
                                    <Button onClick={handleFormSubmit}>{editUser ? 'Cập nhật' : 'Tạo mới'}</Button>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tên</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Vai trò</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Thao tác</TableHead>
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
                                                onCheckedChange={() => toggleUserStatus(user.id, user.status)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" onClick={() => {
                                                setEditUser(user);
                                                setFormData({ name: user.name, email: user.email, password: '', role: user.role });
                                                setOpen(true);
                                            }}>Sửa</Button>
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
                                    <TableHead>Hiển thị</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {courses.map((course: any) => (
                                    <TableRow key={course.id}>
                                        <TableCell>{course.title}</TableCell>
                                        <TableCell>{course.creatorName}</TableCell>
                                        <TableCell>{new Date(course.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Switch
                                                checked={course.visible}
                                                onCheckedChange={() => toggleCourseVisibility(course.id, course.visible)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent value="logs">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thao tác</TableHead>
                                    <TableHead>Người thực hiện</TableHead>
                                    <TableHead>Thời gian</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log: any) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>{log.performedBy}</TableCell>
                                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>
        </ProtectedRoute>
    );
}
