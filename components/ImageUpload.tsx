"use client"

import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, disabled }: ImageUploadProps) => {


    return (
      <div className="space-y-4 w-full flex flex-col justify-center items-center">
        <CldUploadButton
          onSuccess={(result: any) => {
            console.log('URL de l\'image téléchargée :', result.info.secure_url); // Pour le débogage
            onChange(result.info.secure_url);
          }}
          options={{
            maxFiles: 1,
          }}
          uploadPreset="ai-companion"
        >
          <div className="p-4 border-4 border-dashed rounded-lg border-primary/10 hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
            <div className="relative h-40 w-40">
              <Image
                fill
                alt="Upload"
                src={value || "/placeholder.svg"}
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </CldUploadButton>
      </div>
    )
}

export default ImageUpload;
