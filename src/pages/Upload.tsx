import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, Video, FileText, X, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { storage } from '../lib/storage';
import { UploadType, Reel, Post } from '../types';
import { validators, validateFile } from '../lib/validation';
import { notifications } from '../lib/notifications';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

export default function Upload() {
  const [uploadType, setUploadType] = useState<UploadType>('reel');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [isPointer, setIsPointer] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const courses = storage.getCourses();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const fileType = uploadType === 'reel' ? 'video' : 'image';
    const validationError = validateFile(file, fileType);
    
    if (validationError) {
      notifications.error('Invalid File', validationError);
      return;
    }

    setSelectedFile(file);
    setValidationErrors(prev => ({ ...prev, file: '' }));
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    notifications.success('File Selected', `${file.name} is ready for upload`);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (uploadType === 'reel') {
      if (!selectedFile) {
        errors.file = 'Please select a video file';
      }
      
      const reelValidation = validators.reel.validate({ caption, tags });
      if (!reelValidation.isValid) {
        Object.assign(errors, reelValidation.errors);
      }
    } else {
      const postValidation = validators.post.validate({ title, body, tags });
      if (!postValidation.isValid) {
        Object.assign(errors, postValidation.errors);
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading) return;

    if (!validateForm()) {
      notifications.error('Validation Error', 'Please fix the errors below');
      return;
    }

    setIsUploading(true);

    try {
      if (uploadType === 'reel') {
        const reel: Reel = {
          id: Date.now().toString(),
          userId: 'user1', // Current user
          courseId: selectedCourse || undefined,
          videoUrl: previewUrl, // In a real app, this would be uploaded to a server
          thumbUrl: previewUrl, // In a real app, this would be generated
          caption: caption.trim(),
          tags,
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0,
          createdAt: Date.now()
        };

        storage.addReel(reel);
        notifications.success('Reel Uploaded', 'Your reel has been shared successfully!');
      } else {
        const post: Post = {
          id: Date.now().toString(),
          userId: 'user1', // Current user
          courseId: selectedCourse || undefined,
          title: title.trim(),
          body: body.trim(),
          tags,
          likes: 0,
          comments: 0,
          shares: 0,
          createdAt: Date.now(),
          isPointer
        };

        storage.addPost(post);
        notifications.success('Post Created', 'Your post has been shared successfully!');
      }

      // Reset form
      setTitle('');
      setCaption('');
      setBody('');
      setTags([]);
      setTagInput('');
      setSelectedCourse('');
      setIsPointer(false);
      setValidationErrors({});
      removeFile();

    } catch (error) {
      console.error('Upload error:', error);
      notifications.error('Upload Failed', 'Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Content
          </h1>
          <p className="text-gray-600">
            Share a reel, post, or helpful pointer with your campus community
          </p>
        </div>

        <Card>
          <div className="p-6">
            {/* Upload Type Toggle */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setUploadType('reel')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                  uploadType === 'reel'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Video className="w-5 h-5" />
                <span>Reel</span>
              </button>
              <button
                onClick={() => setUploadType('post')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-medium transition-colors ${
                  uploadType === 'post'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Post</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              {uploadType === 'reel' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video File
                  </label>
                  {!selectedFile ? (
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      validationErrors.file 
                        ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
                        : 'border-gray-300 hover:border-primary-500'
                    }`}>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <UploadIcon className="w-12 h-12 text-gray-400" />
                        <span className="text-gray-600">Click to upload video</span>
                        <span className="text-sm text-gray-500">MP4, WEBM up to 50MB</span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <video
                        src={previewUrl}
                        className="w-full h-64 object-cover rounded-xl"
                        controls
                      />
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {validationErrors.file && (
                    <div className="flex items-center space-x-2 mt-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{validationErrors.file}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Title (for posts) */}
              {uploadType === 'post' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Caption (for reels) */}
              {uploadType === 'reel' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Caption
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Describe your reel..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Body (for posts) */}
              {uploadType === 'post' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write your post content... (Markdown supported)"
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              {/* Course Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course (optional)
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" size="sm">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Pointer Toggle (for posts) */}
              {uploadType === 'post' && (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPointer"
                    checked={isPointer}
                    onChange={(e) => setIsPointer(e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="isPointer" className="text-sm font-medium text-gray-700">
                    Mark as helpful pointer
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? 'Uploading...' : `Upload ${uploadType === 'reel' ? 'Reel' : 'Post'}`}
              </Button>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
