import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock } from 'lucide-react';
import { storage } from '../lib/storage';
import Card from '../components/ui/Card';

export default function Courses() {
  const courses = storage.getCourses();
  const reels = storage.getReels();
  const posts = storage.getPosts();

  // Calculate stats for each course
  const getCourseStats = (courseId: string) => {
    const courseReels = reels.filter(reel => reel.courseId === courseId);
    const coursePosts = posts.filter(post => post.courseId === courseId);
    return {
      reels: courseReels.length,
      posts: coursePosts.length,
      total: courseReels.length + coursePosts.length
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Courses
          </h1>
          <p className="text-gray-600">
            Explore content from your enrolled courses
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No courses enrolled</h2>
            <p className="text-gray-500 mb-6">
              You haven't enrolled in any courses yet. Contact your advisor to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              const stats = getCourseStats(course.id);
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={`/courses/${course.id}`}>
                    <Card className="overflow-hidden h-full" hover>
                      {/* Course Cover */}
                      <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700">
                        <img
                          src={course.cover}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-lg text-sm font-semibold">
                            {course.code}
                          </span>
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {course.code}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="w-4 h-4" />
                              <span>{stats.total} posts</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{stats.reels} reels</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
