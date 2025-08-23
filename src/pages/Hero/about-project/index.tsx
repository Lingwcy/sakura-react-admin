import { Badge } from "@/components/ui/badge"
export default function AboutProjectPage(){
    return (
        <div className="text-primary text-3xl mt-50 w-full container flex flex-col justify-center items-center font-bold">
            <h1>Sakura-Admin</h1>
            <h1 className="text-xl italic">Version@Dev 0.1.2</h1>
            <h1 className="text-xl font-mono">lingwcy@126.com</h1>
            <div className="space-x-2">
                <Badge className="text-foreground bg-secondary">react</Badge>
                <Badge className="text-primary bg-secondary">shadcn</Badge>
                <Badge className="text-primary bg-secondary">tailwind css</Badge>
                <Badge className="text-primary bg-secondary">zustand</Badge>
                <Badge className="text-primary bg-secondary">tanstack</Badge>
            </div>
        </div>
    )
}