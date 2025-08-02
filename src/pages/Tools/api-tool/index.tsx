import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Menubar,
    MenubarContent,
    MenubarMenu,
    MenubarTrigger,
    MenubarRadioGroup,
    MenubarRadioItem
} from "@/components/ui/menubar"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, useMemo, useEffect } from "react"
import { ArrowDown } from "lucide-react"
import { apiList } from "@/apis/api-list"
import flattenApiPaths from "@/utils/flatten-api"
import axios from "axios"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useUserStore } from "@/store"
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000
})

export default function APITools() {
    const [currentRequestType, setCurrentRequestType] = useState<string>('GET')
    const [apiItems, setapiItems] = useState<Record<string, string>>()
    const [selectedApi, setSelectedApi] = useState<string>('');
    const [selectedOutput, setSelectedOutput] = useState<string>('Response');
    const [response, setResponse] = useState('');
    const [header, setHeader] = useState('')

    useEffect(() => {
        request.interceptors.request.use((config) => {

            const token = useUserStore.getState().userToken.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            console.log(config)

            return config
        }, (error) => {
            return Promise.reject(error)
        })
    }, [])

    useMemo(() => {
        const result = flattenApiPaths(apiList)
        setapiItems(result)
        for (const key in result) {
            console.log(`Key: ${key}, Value: ${result[key]}`);

        }
    }, [])

    const onRequestSubmit = async () => {
        const res = await request.get(selectedApi)
        console.log(res)
        setResponse(res.data)
    }


    return (
        <div className="container  h-[calc(100vh-105px)] flex flex-col" >
            <div className="flex flex-col">
                <div className="flex space-x-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">{currentRequestType}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuRadioGroup value={currentRequestType} onValueChange={setCurrentRequestType}>
                                <DropdownMenuRadioItem value="GET">GET</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="POST">POST</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="PUT">PUT</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="DELETE">DELETE</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Input value={selectedApi} onChange={(e) => setSelectedApi(e.target.value)} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size='icon' >
                                <ArrowDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-auto">
                            <DropdownMenuRadioGroup value={selectedApi} onValueChange={setSelectedApi}>
                                {
                                    apiItems && Object.entries(apiItems).map(([key, value]) => (
                                        <DropdownMenuRadioItem key={key} value={value}>
                                            <Button variant='secondary'>{key}</Button> {value}
                                        </DropdownMenuRadioItem>
                                    ))
                                }
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant='destructive' onClick={onRequestSubmit}> 发送 </Button>
                </div>
                <div>
                </div>
            </div>

            <div>
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>返回内容</MenubarTrigger>
                        <MenubarContent>
                            <MenubarRadioGroup value={selectedOutput} onValueChange={setSelectedOutput}>
                                <MenubarRadioItem value="Response">Response</MenubarRadioItem>
                                <MenubarRadioItem value="Header">Header</MenubarRadioItem>
                            </MenubarRadioGroup>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <Card>
                    <CardHeader>
                        <CardTitle>{selectedOutput}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {
                            selectedOutput === 'Response' && <div className="max-h-96 overflow-auto">
                                {response ? (
                                    <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto whitespace-pre-wrap">
                                        <code className="language-json">
                                            {JSON.stringify(response, null, 2)}
                                        </code>
                                    </pre>
                                ) : (
                                    <div className="text-gray-500 text-center py-8">
                                        暂无响应数据
                                    </div>
                                )}
                            </div>
                        }

                        {
                            selectedOutput === 'Header' && <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                                defaultValue="item-1"
                            >
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>General</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 text-balance">

                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Request Headers</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 text-balance">

                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>Response Headers</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 text-balance">

                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

                        }
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}