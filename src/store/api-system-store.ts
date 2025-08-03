import { create } from "zustand";

type Store = {
    requestUrl: string,
    requestMethod: string,
    statusCode: number,
    remoteAddress: string,
    referrPolicy: string,
    contentType: string,
    requestHeaders: Record<string, string>,
    responseHeaders: Record<string, string>,
}

type Action ={
    setRequestUrl: (data:string) => void,
    setRequestMethod: (data:string) => void,
    setStatusCode: (data:string) => void,
    setRemoteAddress: (data:string) => void,
    setReferrPolicy: (data:string) => void,
    setContentType: (data:string) => void,
    setRequestHeaders: (data: Record<string, string>) => void,
    setResponseHeaders: (data: Record<string, string>) => void,

}
const useApiSystemStore = create<Store & Action>()(
    (set) => ({
        requestUrl: '',
        requestMethod: undefined,
        statusCode: 0,
        remoteAddress: '',
        referrPolicy: '',
        contentType: '',
        requestHeaders: {},
        responseHeaders: {},
        setRequestUrl: (data: string) => set({ requestUrl: data }),
        setRequestMethod: (data: string) => set({ requestMethod: data}),
        setStatusCode: (data: string) => set({ statusCode: parseInt(data) }),
        setRemoteAddress: (data: string) => set({ remoteAddress: data }),
        setReferrPolicy: (data: string) => set({ referrPolicy: data }),
        setContentType: (data: string) => set({ contentType: data }),
        setRequestHeaders: (data: Record<string, string>) => set({ requestHeaders: data }),
        setResponseHeaders: (data: Record<string, string>) => set({ responseHeaders: data }),
    })
)



export default useApiSystemStore