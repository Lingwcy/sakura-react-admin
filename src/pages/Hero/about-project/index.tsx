import { Badge } from "@/components/ui/badge"
export default function AboutProjectPage(){
    return (
        <div className="text-pink-800 text-3xl h-screen w-full container flex flex-col justify-center items-center font-bold">
            <h1>Sakura-Admin</h1>
            <h1 className="text-xl italic">Version 0.1.2</h1>
            <h1 className="text-xl font-mono">lingwcy@126.com</h1>
            <h1 className="text-xl font-mono">Southwest Minzu University</h1>
            <div className="space-x-2">
                <Badge className="text-pink-800 bg-pink-300">react</Badge>
                <Badge className="text-pink-800 bg-pink-300">shadcn</Badge>
                <Badge className="text-pink-800 bg-pink-300">tailwind css</Badge>
                <Badge className="text-pink-800 bg-pink-300">zustand</Badge>
                <Badge className="text-pink-800 bg-pink-300">tanstack</Badge>
            </div>
        </div>
    )
}