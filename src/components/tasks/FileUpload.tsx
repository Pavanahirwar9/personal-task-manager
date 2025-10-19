import React, { useState, useRef } from 'react';
import { Upload, File, Image, Download, Trash2 } from 'lucide-react';
import type { TaskAttachment } from '../../types';
import { uploadFile, deleteFile, validateFile, downloadFile } from '../../services/fileService';

interface FileUploadProps {
    attachments: TaskAttachment[];
    onAttachmentsChange: (attachments: TaskAttachment[]) => void;
    disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ attachments, onAttachmentsChange, disabled = false }) => {
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (files: FileList) => {
        if (!files.length || disabled) return;

        setUploading(true);
        const newAttachments: TaskAttachment[] = [...attachments];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const validation = validateFile(file);

            if (!validation.isValid) {
                alert(`${file.name}: ${validation.error}`);
                continue;
            }

            try {
                const attachment = await uploadFile(file);
                newAttachments.push(attachment);
            } catch (error) {
                console.error('Upload failed:', error);
                alert(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        onAttachmentsChange(newAttachments);
        setUploading(false);

        // Clear the input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveAttachment = async (attachment: TaskAttachment) => {
        if (disabled) return;

        try {
            await deleteFile(attachment.$id);
            const updatedAttachments = attachments.filter(att => att.$id !== attachment.$id);
            onAttachmentsChange(updatedAttachments);
        } catch (error) {
            console.error('Failed to delete file:', error);
            alert('Failed to delete file. Please try again.');
        }
    };

    const handleDownload = (attachment: TaskAttachment) => {
        try {
            const downloadUrl = downloadFile(attachment.$id);
            window.open(downloadUrl.toString(), '_blank');
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download file.');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isImageFile = (type: string) => {
        return type.startsWith('image/');
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-400'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={() => !disabled && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                    disabled={disabled}
                />

                <Upload className={`h-8 w-8 mx-auto mb-2 ${dragOver ? 'text-primary-600' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Drop files here or click to select'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    Max 10MB • Images, PDFs, Documents
                </p>
            </div>

            {/* Attachment List */}
            {attachments.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Attachments ({attachments.length})</h4>
                    <div className="space-y-2">
                        {attachments.map((attachment) => (
                            <div
                                key={attachment.$id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        {isImageFile(attachment.type) ? (
                                            <Image className="h-5 w-5 text-blue-600" />
                                        ) : (
                                            <File className="h-5 w-5 text-gray-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {attachment.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(attachment.size)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleDownload(attachment)}
                                        className="text-gray-400 hover:text-primary-600 transition-colors"
                                        title="Download"
                                    >
                                        <Download className="h-4 w-4" />
                                    </button>
                                    {!disabled && (
                                        <button
                                            onClick={() => handleRemoveAttachment(attachment)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;