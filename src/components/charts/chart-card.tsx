import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface ChartCardProps {
    title: string,
    children: React.ReactNode,
    className?: string
}

export default function ChartCard({
    title,
    children,
    className
}: ChartCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}