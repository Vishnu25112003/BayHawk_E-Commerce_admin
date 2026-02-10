import { useState, useRef } from 'react';
import { Upload, X, Plus, Video, Link, Play, ExternalLink } from 'lucide-react';
import { Button, Input } from './index';

interface VideoData {
  id: string;
  type: 'url' | 'file';
  url: string;
  name: string;
  thumbnail?: string;
}

interface CompactVideoUploadProps {
  videos: VideoData[];
  onVideosChange: (videos: VideoData[]) => void;
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  maxVideos?: number;
  className?: string;
}

export function CompactVideoUpload({ 
  videos, 
  onVideosChange, 
  videoUrl,
  onVideoUrlChange,
  maxVideos = 3, 
  className = "" 
}: CompactVideoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlError, setUrlError] = useState('');

  const validateVideoUrl = (url: string) => {
    if (!url) return '';
    
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return 'Please enter a valid URL';
    }

    // Check for common video platforms
    const videoPatterns = [
      /youtube\.com\/watch\?v=|youtu\.be\//,
      /vimeo\.com\//,
      /dailymotion\.com\//,
      /facebook\.com\/.*\/videos\//,
      /instagram\.com\/p\//,
      /\.mp4$|\.webm$|\.ogg$/i
    ];

    const isValidVideo = videoPatterns.some(pattern => pattern.test(url));
    if (!isValidVideo) {
      return 'Please enter a valid video URL (YouTube, Vimeo, etc.)';
    }

    return '';
  };

  const handleVideoUrlChange = (url: string) => {
    onVideoUrlChange(url);
    const error = validateVideoUrl(url);
    setUrlError(error);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const videoFiles = files.filter(file => file.type.startsWith('video/'));
      const newVideos = videoFiles.map(file => ({
        id: Date.now().toString() + Math.random(),
        type: 'file' as const,
        url: URL.createObjectURL(file),
        name: file.name,
        thumbnail: undefined
      }));
      
      const updatedVideos = [...videos, ...newVideos].slice(0, maxVideos);
      onVideosChange(updatedVideos);
    }
    
    // Reset input value
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeVideo = (id: string) => {
    const updatedVideos = videos.filter(video => video.id !== id);
    onVideosChange(updatedVideos);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getVideoThumbnail = (url: string, type: 'url' | 'file') => {
    if (type === 'url') {
      // Extract YouTube thumbnail
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      if (youtubeMatch) {
        return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
      }
      
      // Extract Vimeo thumbnail (would need API call in real implementation)
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
      }
    }
    
    return null;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Video URL Input - Mandatory */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video URL (Optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Link className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="url"
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            value={videoUrl}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            className={`pl-10 ${urlError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            
          />
          {videoUrl && !urlError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <a 
                href={videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
                title="Open video in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
        {urlError && (
          <p className="mt-1 text-sm text-red-600">{urlError}</p>
        )}
        {videoUrl && !urlError && (
          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
            <Play className="h-3 w-3" />
            Valid video URL detected
          </p>
        )}
      </div>

      {/* Additional Video Files - Optional */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Additional Videos <span className="text-gray-500">(Optional)</span>
          </label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={openFileDialog}
            disabled={videos.length >= maxVideos}
            className="text-xs"
          >
            <Upload className="h-3 w-3 mr-1" />
            Upload Video
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Compact Video Grid */}
        {videos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {videos.map((video) => {
              const thumbnail = getVideoThumbnail(video.url, video.type);
              
              return (
                <div key={video.id} className="relative group">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                    {thumbnail ? (
                      <img 
                        src={thumbnail} 
                        alt={video.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    
                    {/* Video Type Badge */}
                    <div className="absolute top-1 left-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded text-white font-medium ${
                        video.type === 'url' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}>
                        {video.type === 'url' ? 'URL' : 'FILE'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Video Name */}
                  <p className="text-xs text-gray-600 mt-1 truncate" title={video.name}>
                    {video.name}
                  </p>
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeVideo(video.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    title="Remove video"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            
            {/* Add More Slot */}
            {videos.length < maxVideos && (
              <div
                onClick={openFileDialog}
                className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Plus className="h-4 w-4 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Add Video</span>
              </div>
            )}
          </div>
        )}

        {videos.length === 0 && (
          <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
            <Video className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No additional videos uploaded</p>
            <p className="text-xs text-gray-400 mt-1">Click "Upload Video" to add optional video files</p>
          </div>
        )}

        {/* Video Count Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          <span>{videos.length} of {maxVideos} additional videos</span>
          <span>Supported: MP4, WebM, MOV</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-1">Video Upload Instructions:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• <strong>Video URL is mandatory</strong> - Use YouTube, Vimeo, or direct video links</li>
          <li>• Additional video files are optional for backup or alternative content</li>
          <li>• Keep video files under 100MB for better performance</li>
          <li>• Recommended formats: MP4, WebM for best compatibility</li>
        </ul>
      </div>
    </div>
  );
}

export type { VideoData };