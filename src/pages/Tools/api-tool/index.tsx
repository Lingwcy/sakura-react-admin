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
import { useUserStore, useApiSystemStore } from "@/store"
const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 5000
})

export default function APITools() {
    const [currentRequestType, setCurrentRequestType] = useState<string>('GET')
    const [apiItems, setapiItems] = useState<Record<string, string>>()
    const [selectedApi, setSelectedApi] = useState<string>('');
    const [selectedApiKey, setSelectedApiKey] = useState<string>('');
    const [selectedOutput, setSelectedOutput] = useState<string>('Response');
    const [response, setResponse] = useState<string | object>('');
    const systemStore = useApiSystemStore()

    useEffect(() => {
        request.interceptors.request.use((config) => {

            const token = useUserStore.getState().userToken.token;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            console.log(config)

            const fullUrl = config.url ? `${config.baseURL}${config.url}` : config.baseURL || ''
            const store = useApiSystemStore.getState()
            store.setRequestUrl(fullUrl)
            store.setRequestMethod(config.method?.toUpperCase() || 'GET')

            // 设置请求头信息
            const requestHeaders: Record<string, string> = {}
            if (config.headers) {
                Object.keys(config.headers).forEach(key => {
                    if (config.headers[key] !== undefined) {
                        requestHeaders[key] = String(config.headers[key])
                    }
                })
            }
            store.setRequestHeaders(requestHeaders)

            return config
        }, (error) => {
            return Promise.reject(error)
        })

        request.interceptors.response.use((res) => {
            console.log(res)

            const store = useApiSystemStore.getState()
            store.setStatusCode(res.status.toString())

            // 设置响应头信息
            const responseHeaders: Record<string, string> = {}
            if (res.headers) {
                Object.keys(res.headers).forEach(key => {
                    responseHeaders[key] = String(res.headers[key])
                })
            }
            store.setResponseHeaders(responseHeaders)

            return res

        })
    }, [])

    useMemo(() => {
        const result = flattenApiPaths(apiList)
        setapiItems(result)
    }, [])

    const onRequestSubmit = async () => {
        try {
            let res;
            const method = currentRequestType.toLowerCase();
            const apiUrl = selectedApiKey && apiItems ? apiItems[selectedApiKey] : selectedApi;
            
            switch (method) {
                case 'get':
                    res = await request.get(apiUrl);
                    break;
                case 'post':
                    res = await request.post(apiUrl);
                    break;
                case 'put':
                    res = await request.put(apiUrl);
                    break;
                case 'delete':
                    res = await request.delete(apiUrl);
                    break;
                default:
                    res = await request.get(apiUrl);
            }
            
            setResponse(res.data);
        } catch (error) {
            console.error('Request failed:', error);
            setResponse({ error: 'Request failed' });
        }
    }

    const handleApiKeyChange = (key: string) => {
        setSelectedApiKey(key);
        if (apiItems && key in apiItems) {
            setSelectedApi(apiItems[key]);
        }
    }

    return (
        <div className="container  h-[calc(100vh-105px)] flex flex-col space-y-5" >
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
                    <Input 
                        value={selectedApi} 
                        onChange={(e) => {
                            setSelectedApi(e.target.value);
                            setSelectedApiKey(''); // 清空选中的API key，因为用户手动输入了URL
                        }} 
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size='icon' >
                                <ArrowDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-auto">
                            <DropdownMenuRadioGroup value={selectedApiKey} onValueChange={handleApiKeyChange}>
                                {
                                    apiItems && Object.entries(apiItems).map(([key, value]) => (
                                        <DropdownMenuRadioItem key={key} value={key}>
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
                                            {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
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
                                type='multiple'
                                className="w-full"
                            >
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-2xl">通用</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 text-balance">
                                        <div className="space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <span className="font-semibold text-sm min-w-[120px] text-blue-600">Request URL:</span>
                                                <span className="text-sm text-gray-700 break-all">{systemStore.requestUrl || '暂无'}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <span className="font-semibold text-sm min-w-[120px] text-blue-600">Request Method:</span>
                                                <span className="text-sm text-gray-700">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${systemStore.requestMethod === 'GET' ? 'bg-green-100 text-green-800' :
                                                            systemStore.requestMethod === 'POST' ? 'bg-blue-100 text-blue-800' :
                                                                systemStore.requestMethod === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                                                                    systemStore.requestMethod === 'DELETE' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {systemStore.requestMethod || 'N/A'}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <span className="font-semibold text-sm min-w-[120px] text-blue-600">Status Code:</span>
                                                <span className="text-sm text-gray-700">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${systemStore.statusCode >= 200 && systemStore.statusCode < 300 ? 'bg-green-100 text-green-800' :
                                                            systemStore.statusCode >= 300 && systemStore.statusCode < 400 ? 'bg-yellow-100 text-yellow-800' :
                                                                systemStore.statusCode >= 400 ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {systemStore.statusCode || 'N/A'}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-2xl">请求头</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 text-balance">
                                        {Object.keys(systemStore.requestHeaders).length > 0 ? (
                                            <div className="space-y-2">
                                                {Object.entries(systemStore.requestHeaders).map(([key, value]) => (
                                                    <div key={key} className="flex flex-col sm:flex-row sm:items-center pb-2">
                                                        <span className="font-semibold text-sm min-w-[150px] text-blue-600">{key}:</span>
                                                        <span className="text-sm text-gray-700 break-all">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">暂无请求头信息</p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-2xl">响应头</AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-4 text-balance">
                                        {Object.keys(systemStore.responseHeaders).length > 0 ? (
                                            <div className="space-y-2">
                                                {Object.entries(systemStore.responseHeaders).map(([key, value]) => (
                                                    <div key={key} className="flex flex-col sm:flex-row sm:items-center pb-2">
                                                        <span className="font-semibold text-sm min-w-[150px] text-green-600">{key}:</span>
                                                        <span className="text-sm text-gray-700 break-all">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">暂无响应头信息</p>
                                        )}
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