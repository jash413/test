// components/DeleteConfirmationDialog.tsx

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemType: string;
  confirmText: string;
  apiEndpoint: string;
  redirectPath: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  itemName,
  itemType,
  confirmText,
  apiEndpoint,
  redirectPath
}) => {
  const [inputConfirmText, setInputConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleConfirmDelete = async () => {
    if (inputConfirmText === confirmText) {
      setIsDeleting(true);
      try {
        const response = await fetch(apiEndpoint, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`Failed to delete ${itemType}`);
        }

        setDeleteSuccess(true);
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 2000);
      } catch (error) {
        // console.error(`Error deleting ${itemType}:`, error);
        setIsDeleting(false);
      }
    } else {
      //   console.error(`${itemType} name doesn't match`);
      // You might want to show an error message to the user here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!deleteSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this {itemType}?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. Please type &quot;{confirmText}
                &quot; to confirm.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={inputConfirmText}
              onChange={(e) => setInputConfirmText(e.target.value)}
              placeholder={`Type ${confirmText} here`}
              disabled={isDeleting}
            />
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? `Deleting ${itemType}...` : `Delete ${itemType}`}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{itemType} Deleted Successfully</DialogTitle>
              <DialogDescription>
                The {itemType} has been deleted. You will be redirected shortly.
              </DialogDescription>
            </DialogHeader>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
