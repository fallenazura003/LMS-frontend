// app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogTrigger } from '@/components/ui/dialog'; // Chỉ cần DialogTrigger ở đây
import UserFormDialog from "../../../../components/admin/UserFormDialog"

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'ACTIVE' | 'BLOCKED';
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await api.get<User[]>('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleUserStatus = async (userId: string, currentStatus: string) => {
        const confirmChange = window.confirm('Bạn có chắc chắn muốn thay đổi trạng thái người dùng này không?');
        if (!confirmChange) return;
        try {
            await api.patch(`/admin/users/${userId}/status`, {
                status: currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
            });
            await fetchUsers(); // Refresh data
        } catch (err) {
            console.error('Lỗi khi thay đổi trạng thái người dùng:', err);
        }
    };

    const handleOpenCreateUser = () => {
        setEditUser(null);
        setOpenDialog(true);
    };

    const handleEditUser = (user: User) => {
        setEditUser(user);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setEditUser(null); // Clear editUser when dialog closes
        fetchUsers(); // Refresh users after create/update
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Quản lý người dùng</h1>
            <div className="mb-4 text-right">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button onClick={handleOpenCreateUser}>Tạo người dùng</Button>
                    </DialogTrigger>
                    <UserFormDialog user={editUser} onClose={handleDialogClose} />
                </Dialog>
            </div>

            <Table className="bg-white shadow-md rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead>Tên</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Vai trò</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-center">Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Switch
                                    checked={user.status === 'ACTIVE'}
                                    onCheckedChange={() => toggleUserStatus(user.id, user.status)}
                                    aria-label={`Toggle status for ${user.name}`}
                                />
                                <span className="ml-2 text-sm text-gray-500">
                                    {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị chặn'}
                                </span>
                            </TableCell>
                            <TableCell className="text-center">
                                <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                    Sửa
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}