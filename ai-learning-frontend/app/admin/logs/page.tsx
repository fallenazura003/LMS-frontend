// app/admin/logs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface LogEntry {
    id: string;
    action: string;
    performedBy: string;
    timestamp: string; // ISO string
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await api.get<LogEntry[]>('/admin/logs');
                setLogs(res.data);
            } catch (error) {
                console.error('Lỗi khi tải logs:', error);
            }
        };
        fetchLogs();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Lịch sử hoạt động (Logs)</h1>
            <Table className="bg-white shadow-md rounded-lg">
                <TableHeader>
                    <TableRow>
                        <TableHead>Thao tác</TableHead>
                        <TableHead>Người thực hiện</TableHead>
                        <TableHead>Thời gian</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.action}</TableCell>
                            <TableCell>{log.performedBy}</TableCell>
                            <TableCell>{new Date(log.timestamp).toLocaleString('vi-VN', {
                                year: 'numeric', month: 'numeric', day: 'numeric',
                                hour: 'numeric', minute: 'numeric', second: 'numeric',
                                hour12: false
                            })}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}