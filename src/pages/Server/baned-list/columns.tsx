import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { DynamicBanner } from "@/components/banner"
import type { MinecraftServerItem } from "@/types/minecraft-server-item-type"

export const columns: ColumnDef<MinecraftServerItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        名称
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "icon",
    header: "图标",
    cell: ({ row }) => (
      <div className="w-10 h-10">
        <img
          src={row.getValue("icon")}
          alt="Server icon"
          width={40}
          height={40}
          className="rounded"
        />
      </div>
    ),
  },
  {
    accessorKey: "banner",
    header: "横幅",
    minSize: 200, // 最小宽度
    maxSize: 300, // 最大宽度
    cell: ({ row }) => (
      <DynamicBanner url={row.getValue('banner')} />
    ),
  },
  {
    accessorKey: "version",
    header: "版本",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("version")}
      </Badge>
    ),
  },
  {
    accessorKey: "backendType",
    header: "核心",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.getValue("backendType")}
      </Badge>
    ),
  },
  {
    accessorKey: "edition",
    header: "平台",
    cell: ({ row }) => (
      <Badge variant={row.getValue("edition") === "java" ? "default" : "destructive"}>
        {(row.getValue("edition") as string).toUpperCase()}
      </Badge>
    ),
  },
  {
    accessorKey: "gamemodes",
    header: "玩法类型",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("gamemodes")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      const status = row.original.status
      return status ? (
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${status.isRuning ? "bg-green-500" : "bg-red-500"
            }`} />
          <span>
            {status.isRuning ? (
              `${status.players}/${status.maxPlayers} 在线`
            ) : (
              "离线"
            )}
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground">Unknown</span>
      )
    },
  },
  {
    accessorKey: "javaAddress",
    header: "java地址",
    cell: ({ row }) => (
      row.getValue("javaAddress") ? (
        <span className="font-mono">
          {row.getValue("javaAddress")}:{row.original.javaAddressPort}
        </span>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      )
    ),
  },
  {
    accessorKey: "bedrockAddress",
    header: "基岩地址",
    cell: ({ row }) => (
      row.getValue("bedrockAddress") ? (
        <span className="font-mono">
          {row.getValue("bedrockAddress")}:{row.original.bedrockAddressPort}
        </span>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      )
    ),
  },
  {
    accessorKey: "arichiveDate",
    header: "收录时间",
    cell: ({ row }) => (
      <span>
        {new Date(row.getValue("arichiveDate")).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const server = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(server.id)}
            >
              复制 服务器 ID
            </DropdownMenuItem>
            {server.javaAddress && (
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(
                  `${server.javaAddress}:${server.javaAddressPort}`
                )}
              >
              复制 Java 地址
              </DropdownMenuItem>
            )}
            {server.bedrockAddress && (
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(
                  `${server.bedrockAddress}:${server.bedrockAddressPort}`
                )}
              >
                复制 基岩 地址
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>详细面板</DropdownMenuItem>
            <DropdownMenuItem>编辑</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
                删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]