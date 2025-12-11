"use client"

import { useState, useRef } from "react"
import { Camera, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface PhotoUploaderProps {
  currentPhotoUrl?: string | null
  onUpload: (url: string) => void
  onRemove: () => void
  disabled?: boolean
}

// Compress image client-side before upload
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    img.onload = () => {
      // Max dimension 1200px
      const maxDim = 1200
      let { width, height } = img

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = (height / width) * maxDim
          width = maxDim
        } else {
          width = (width / height) * maxDim
          height = maxDim
        }
      }

      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error("Failed to compress image"))
        },
        "image/jpeg",
        0.8 // Quality 0.8
      )
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

export function PhotoUploader({
  currentPhotoUrl,
  onUpload,
  onRemove,
  disabled = false,
}: PhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input for same file selection
    e.target.value = ""

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Compress image
      const compressed = await compressImage(file)

      // Generate unique filename
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 8)
      const filename = `${timestamp}-${randomId}.jpg`

      // Upload to Supabase Storage
      const supabase = createClient()
      const { data, error: uploadError } = await supabase.storage
        .from("itp-photos")
        .upload(filename, compressed, {
          contentType: "image/jpeg",
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("itp-photos")
        .getPublicUrl(data.path)

      onUpload(urlData.publicUrl)
    } catch (err) {
      console.error("Upload failed:", err)
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {currentPhotoUrl ? (
        <div className="relative inline-block">
          <img
            src={currentPhotoUrl}
            alt="Evidence photo"
            className="h-20 w-20 rounded-lg object-cover border border-border"
          />
          {!disabled && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                Add Photo
              </>
            )}
          </Button>
        </>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
