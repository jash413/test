// file: components/FilePreview.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { DeleteIcon } from './forms/MultiStep/formUtils';

interface FilePreviewProps {
  file: File | string;
  contentType?: string;
  onDelete?: () => void;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  contentType,
  onDelete,
  className = ''
}) => {
  const [objectUrl, setObjectUrl] = React.useState<string>('');

  React.useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setObjectUrl(file);
    }
  }, [file]);

  const isImage =
    file instanceof File
      ? file.type.startsWith('image/')
      : contentType?.startsWith('image/') ||
        file.match(/\.(jpeg|jpg|gif|png)$/i) !== null;

  const fileName =
    file instanceof File ? file.name : file.split('/').pop() || 'File';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {isImage ? (
        <Image
          src={objectUrl}
          alt={fileName}
          className="h-20 w-20 rounded object-cover"
          width={80}
          height={80}
        />
      ) : (
        <span className="text-blue-600">{fileName}</span>
      )}
      {onDelete && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <DeleteIcon />
        </Button>
      )}
    </div>
  );
};
