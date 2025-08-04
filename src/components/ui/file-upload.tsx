import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, UploadCloud } from "lucide-react";

export default function FileUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const uploadedFile = e.dataTransfer.files[0];
        validateAndSetFile(uploadedFile);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        // 校验文件类型（示例：仅允许图片）
        if (!file.type.startsWith("image/")) {
            setError("仅支持图片文件（JPEG/PNG）");
            return;
        }

        // 校验文件大小（示例：最大5MB）
        if (file.size > 5 * 1024 * 1024) {
            setError("文件大小不能超过5MB");
            return;
        }

        setError("");
        setFile(file);
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    return (
        <Card className="w-full max-w-md">
            <CardContent>
                <div>
                    {/* 拖拽区域 */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center justify-center gap-2 " >
                                <UploadCloud className="h-8 w-8 text-gray-400" />
                                <Label className="cursor-pointer">
                                    <span className="font-medium text-primary">点击上传</span> 或拖拽文件到此处
                                </Label>
                                <p className="text-sm text-gray-500">支持 JPEG, PNG (最大 5MB)</p>
                            </div>
                        </label>
                        <Input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/jpeg,image/png"
                        />
                    </div>

                    {/* 错误提示 */}
                    {error && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <X className="h-4 w-4" /> {error}
                        </p>
                    )}

                    {/* 文件预览 */}
                    {file && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">
                                    已选择: <span className="text-primary">{file.name}</span>
                                </p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveFile}
                                    className="text-destructive hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            {file.type.startsWith("image/") && (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="预览"
                                    className="mt-2 rounded-md border border-gray-200 max-h-40 object-contain"
                                />
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}