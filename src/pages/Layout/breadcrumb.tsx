import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useBread } from "@/hooks/use-system"
export default function HeaderBreadCrumb() {
    
     const { currentBread } = useBread()
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {currentBread && currentBread.length > 0 && (
                    <>
                        {currentBread.map((bread, index) => (
                            <BreadcrumbItem key={index}>
                                {index === currentBread.length - 1 ? (
                                    <BreadcrumbPage>{bread}</BreadcrumbPage>
                                ) : (
                                    <>
                                        <BreadcrumbLink href="#">{bread}</BreadcrumbLink>
                                        <BreadcrumbSeparator />
                                    </>
                                )}
                            </BreadcrumbItem>
                        ))}
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}