<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateFileUploads
{
    /**
     * Maximum file size in kilobytes (10MB default)
     */
    protected int $maxFileSize = 10240;

    /**
     * Allowed mime types for images
     */
    protected array $allowedImageMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ];

    /**
     * Allowed mime types for documents
     */
    protected array $allowedDocumentMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    /**
     * Allowed mime types for videos
     */
    protected array $allowedVideoMimes = [
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->hasFile('photo') || $request->hasFile('image') || $request->hasFile('profile_image')) {
            $this->validateImages($request);
        }

        if ($request->hasFile('receipt')) {
            $this->validateDocuments($request);
        }

        if ($request->hasFile('video_url')) {
            $this->validateVideos($request);
        }

        return $next($request);
    }

    protected function validateImages(Request $request): void
    {
        $fileKeys = ['photo', 'image', 'profile_image', 'image_primary', 'image_secondary'];
        
        foreach ($fileKeys as $key) {
            if ($request->hasFile($key)) {
                $file = $request->file($key);
                
                // Check file size
                if ($file->getSize() > $this->maxFileSize * 1024) {
                    abort(413, "File size exceeds maximum allowed size of {$this->maxFileSize}KB");
                }
                
                // Check mime type
                if (!in_array($file->getMimeType(), $this->allowedImageMimes)) {
                    abort(422, 'Invalid file type. Only images are allowed.');
                }
                
                // Additional security: Check actual file content
                if (!$this->isValidImage($file)) {
                    abort(422, 'Invalid image file.');
                }
            }
        }
    }

    protected function validateDocuments(Request $request): void
    {
        if ($request->hasFile('receipt')) {
            $file = $request->file('receipt');
            
            if ($file->getSize() > $this->maxFileSize * 1024) {
                abort(413, "File size exceeds maximum allowed size of {$this->maxFileSize}KB");
            }
            
            $allowedMimes = array_merge($this->allowedImageMimes, $this->allowedDocumentMimes);
            
            if (!in_array($file->getMimeType(), $allowedMimes)) {
                abort(422, 'Invalid file type for receipt.');
            }
        }
    }

    protected function validateVideos(Request $request): void
    {
        if ($request->hasFile('video_url')) {
            $file = $request->file('video_url');
            
            // Videos can be larger
            $maxVideoSize = 50 * 1024; // 50MB
            
            if ($file->getSize() > $maxVideoSize * 1024) {
                abort(413, "Video size exceeds maximum allowed size of {$maxVideoSize}MB");
            }
            
            if (!in_array($file->getMimeType(), $this->allowedVideoMimes)) {
                abort(422, 'Invalid video file type.');
            }
        }
    }

    protected function isValidImage($file): bool
    {
        try {
            $imageInfo = @getimagesize($file->getRealPath());
            return $imageInfo !== false;
        } catch (\Exception $e) {
            return false;
        }
    }
}
