'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/Pagination';

interface Event {
    id: string;
    action: string;
    performedBy: string;
    timestamp: string;
}

interface PageResponse<T> {
    content: T[];
    number: number;
    totalPages: number;
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<Event[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchLogs = async (page = 0) => {
        try {
            const res = await api.get<PageResponse<Event>>(`/admin/logs?page=${page}&size=10`);
            setLogs(res.data.content);
            setCurrentPage(res.data.number);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.error('Lỗi khi tải log hệ thống:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Quản lý log hệ thống</h1>
            <Table className="bg-white shadow-md rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead>Hành động</TableHead>
                        <TableHead>Thực hiện bởi</TableHead>
                        <TableHead>Thời gian</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>{log.performedBy}</TableCell>
                            <TableCell>{new Date(log.timestamp).toLocaleString('vi-VN')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={fetchLogs}
                    />
                </div>
            )}
        </div>
    );
}
