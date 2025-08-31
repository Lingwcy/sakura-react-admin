
export default function ContentLoading() {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-foreground">加载中...</p>
            </div>
        </div>
    )
}