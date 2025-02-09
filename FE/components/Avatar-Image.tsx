import React, { useState, ChangeEvent, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2 } from "lucide-react";

interface AvatarUploadProps {
  profile: {
    name: string;
    image?: string;
  };
  onImageUpload: (file: File) => void;
  onImageRemove?: () => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  profile, 
  onImageUpload, 
  onImageRemove 
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (JPEG, PNG, or GIF)');
        return;
      }

      if (file.size > maxSize) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Call upload handler
      onImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove?.();
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="w-24 h-24">
        <AvatarImage 
          src={previewImage || profile.image || "/placeholder.svg"} 
          alt={profile.name} 
        />
        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col space-y-2">
        <Label htmlFor="image-upload" className="cursor-pointer">
          <Button 
            variant="outline" 
            className="flex items-center space-x-2"
          >
            <ImagePlus className="w-4 h-4" />
            <span>Upload New Image</span>
          </Button>
        </Label>
        
        <Input 
          ref={fileInputRef}
          id="image-upload" 
          type="file" 
          accept="image/jpeg,image/png,image/gif" 
          className="hidden" 
          onChange={handleImageChange} 
        />
        
        {(previewImage || profile.image) && (
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleRemoveImage}
            className="flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove Image</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;