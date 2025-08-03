
import { columns } from './columns'
import { useState } from "react";
import servermockjson from '@assets/mock-server-list.json'
import type { MinecraftServerItem } from "@/types/minecraft-server-item-type";
import { SakuraTable } from '@/components/table';

const mockdata = servermockjson as MinecraftServerItem[];


export default function ArchiveServerPage() {
    const [data] = useState<MinecraftServerItem[]>(mockdata);
    return (
        <div className="container mx-auto py-10 h-[calc(100vh-105px)]">
            <SakuraTable
                columns={columns}
                data={data}
                searchPlaceholder='搜索名称'
                createButtonText='新增服务器'
                searchKey='name'
                onClickCreate={() => { }}
            />
        </div>
    )
}