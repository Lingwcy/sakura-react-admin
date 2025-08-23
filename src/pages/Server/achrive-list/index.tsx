
import { columns } from './columns'
import { useState } from "react";
import servermockjson from '@assets/mock-server-list.json'
import type { MinecraftServerItem } from "@/types/minecraft-server-item-type";
import { SakuraTable } from '@/components/table';

const mockdata = servermockjson.map(item => ({
    ...item,
    arichiveDate: new Date(item.arichiveDate)
})) as MinecraftServerItem[];


export default function ArchiveServerPage() {
    const [data] = useState<MinecraftServerItem[]>(mockdata);
    return (
        <div className="container mx-auto py-4">
            <SakuraTable
                columns={columns}
                data={data}
            />
        </div>
    )
}