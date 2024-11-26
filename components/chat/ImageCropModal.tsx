import React, { useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Cropper, { Area } from 'react-easy-crop';
import { Cross2Icon } from '@radix-ui/react-icons';
import getCroppedImg from './cropImage'; // Utility function to get cropped image

const ImageCropModal: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedAreaPixels);
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!imageSrc || !croppedArea) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedArea);
      // Handle saving the cropped image (e.g., send it to a server or use it in the app)
      console.log('Cropped Image: ', croppedImage);
    } catch (error) {
      console.error('Failed to crop the image:', error);
    }
  }, [imageSrc, croppedArea]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="Button violet">Upload and Crop Image</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <Dialog.Title className="DialogTitle">Crop Image</Dialog.Title>
          <Dialog.Description className="DialogDescription">
            Adjust the image and click save to crop.
          </Dialog.Description>

          {imageSrc ? (
            <div className="crop-container">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          ) : (
            <input type="file" accept="image/*" onChange={handleFileChange} />
          )}

          <div
            style={{
              display: 'flex',
              marginTop: 25,
              justifyContent: 'flex-end'
            }}
          >
            <button className="Button green" onClick={handleSave}>
              Save changes
            </button>
          </div>
          <Dialog.Close asChild>
            <button className="IconButton" aria-label="Close">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImageCropModal;
