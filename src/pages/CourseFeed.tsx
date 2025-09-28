import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Pin } from 'lucide-react';
import { storage } from '../lib/storage';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ReelCard from '../components/feed/ReelCard';
import PostCard from '../components/feed/PostCard';
import PointerCard from '../components/feed/PointerCard';

export default function CourseFeed() {
  const { courseId } = useParams<{ courseId: string }>();
  const courses = storage.getCourses();
  const reels = storage.getReels();
  const posts = storage.getPosts();
  const pointers = storage.getPointers();

  const course = courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <Link to="/courses">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Back to Courses
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter content for this course
  const courseReels = reels.filter(reel => reel.courseId === courseId);
  const coursePosts = posts.filter(post => post.courseId === courseId);
  const coursePointers = pointers.filter(pointer => pointer.courseId === courseId);

  // Combine and sort all content
  const allContent = [
    ...courseReels.map(reel => ({ ...reel, type: 'reel' as const })),
    ...coursePosts.map(post => ({ ...post, type: 'post' as const })),
    ...coursePointers.map(pointer => ({ ...pointer, type: 'pointer' as const }))
  ].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back Button */}
        <Link to="/courses" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </Link>

        {/* Course Header */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {course.title}
                </h1>
                <p className="text-gray-600 mb-3">
                  {course.code}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{courseReels.length} reels</span>
                  <span>{coursePosts.length} posts</span>
                  <span>{coursePointers.length} pointers</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Pinned Pointers */}
        {coursePointers.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Pin className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Pinned Pointers</h2>
            </div>
            <div className="space-y-4">
              {coursePointers.slice(0, 3).map((pointer, index) => (
                <motion.div
                  key={pointer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <PointerCard pointer={pointer} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Course Content */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">All Content</h2>
          
          {allContent.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No content yet</h3>
              <p className="text-gray-500 mb-6">
                Be the first to share something for this course!
              </p>
              <Link to="/upload">
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Upload Content
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {allContent.map((item, index) => (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {item.type === 'reel' && <ReelCard reel={item} />}
                  {item.type === 'post' && <PostCard post={item} />}
                  {item.type === 'pointer' && <PointerCard pointer={item} />}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
