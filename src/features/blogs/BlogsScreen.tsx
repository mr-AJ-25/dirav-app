import { useState, useEffect } from 'react';
import { DiravCard, DiravBadge, DiravButton } from '@/core/widgets';
import { DiravColors } from '@/core/theme/colors';
import { MockDatabase, BlogModel } from '@/data/mockDatabase';
import { ChevronRightIcon, BlogIcon, CloseIcon, CheckIcon, ShareIcon } from '@/core/icons/Icons';
import { getBookmarkedBlogs, saveBookmarkedBlogs } from '@/services/storageService';

interface BlogsScreenProps {
  embedded?: boolean;
}

export function BlogsScreen({ embedded = false }: BlogsScreenProps) {
  const [selectedBlog, setSelectedBlog] = useState<BlogModel | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(() => {
    return localStorage.getItem('dirav_newsletter_subscribed') === 'true';
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState<string[]>(() => getBookmarkedBlogs());

  useEffect(() => {
    saveBookmarkedBlogs(bookmarkedBlogs);
  }, [bookmarkedBlogs]);

  const featuredBlog = MockDatabase.blogs.find((b) => b.isFeatured);
  const recentBlogs = MockDatabase.blogs.filter((b) => !b.isFeatured);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Budgeting: DiravColors.primary,
      Scholarships: DiravColors.info,
      Saving: DiravColors.success,
      Income: DiravColors.warning,
    };
    return colors[category] || DiravColors.primary;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const showSuccessToast = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      showSuccessToast('Please enter a valid email');
      return;
    }
    setSubscribed(true);
    localStorage.setItem('dirav_newsletter_subscribed', 'true');
    showSuccessToast('Successfully subscribed!');
  };

  const handleShare = (blog: BlogModel) => {
    const shareData = {
      title: blog.title,
      text: blog.excerpt,
      url: window.location.href,
    };
    
    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        navigator.clipboard.writeText(`${blog.title}\n${blog.excerpt}\n${window.location.href}`);
        showSuccessToast('Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(`${blog.title}\n${blog.excerpt}\n${window.location.href}`);
      showSuccessToast('Link copied to clipboard!');
    }
  };

  const toggleBookmark = (blogId: string) => {
    setBookmarkedBlogs(prev => {
      if (prev.includes(blogId)) {
        showSuccessToast('Bookmark removed');
        return prev.filter(id => id !== blogId);
      } else {
        showSuccessToast('Article bookmarked!');
        return [...prev, blogId];
      }
    });
  };

  return (
    <div className={`min-h-full ${embedded ? 'p-4 pb-4' : 'p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8'}`}>
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#10B981] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckIcon size={20} />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Header - hide when embedded */}
      {!embedded && (
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827]">Financial Insights</h1>
          <p className="text-sm sm:text-base text-[#6B7280] mt-1">
            Learn smart money management from our experts
          </p>
        </div>
      )}

      {/* Featured Article */}
      {featuredBlog && (
        <DiravCard className="mb-4 sm:mb-6" padding="none">
          <div className="flex flex-col lg:flex-row">
            {/* Image Placeholder */}
            <button
              onClick={() => setSelectedBlog(featuredBlog)}
              className="lg:w-2/5 h-40 sm:h-48 lg:h-auto rounded-t-2xl sm:rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none flex items-center justify-center transition-all hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${DiravColors.primary}20 0%, ${DiravColors.accentGradientEnd}20 100%)`,
              }}
            >
              <BlogIcon size={48} className="text-[#7C3AED]/30 sm:w-16 sm:h-16" />
            </button>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
              <div className="mb-3 sm:mb-4 flex items-center gap-2">
                <DiravBadge
                  label={featuredBlog.category}
                  color={getCategoryColor(featuredBlog.category)}
                  textColor="white"
                />
                <span className="text-xs text-[#6B7280]">• Featured</span>
              </div>
              <h2 
                className="text-lg sm:text-2xl font-bold text-[#111827] mb-2 sm:mb-3 cursor-pointer hover:text-[#7C3AED] transition-colors"
                onClick={() => setSelectedBlog(featuredBlog)}
              >
                {featuredBlog.title}
              </h2>
              <p className="text-sm sm:text-base text-[#6B7280] mb-3 sm:mb-4 line-clamp-2">{featuredBlog.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#6B7280]">
                  {featuredBlog.readTime}
                </span>
                <button
                  onClick={() => setSelectedBlog(featuredBlog)}
                  className="flex items-center gap-1 font-semibold hover:underline text-sm sm:text-base"
                  style={{ color: DiravColors.primary }}
                >
                  Read Article
                  <ChevronRightIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </DiravCard>
      )}

      {/* Bookmarked Articles */}
      {bookmarkedBlogs.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-[#111827] mb-3">Your Bookmarks</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {MockDatabase.blogs
              .filter(blog => bookmarkedBlogs.includes(blog.id))
              .map(blog => (
                <button
                  key={blog.id}
                  onClick={() => setSelectedBlog(blog)}
                  className="flex-shrink-0 bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-3 min-w-[200px]"
                >
                  <span className="text-2xl">🔖</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#111827] line-clamp-1">{blog.title}</p>
                    <p className="text-xs text-[#6B7280]">{blog.readTime}</p>
                  </div>
                </button>
              ))
            }
          </div>
        </div>
      )}

      {/* Recent Articles */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-[#111827]">Recent Articles</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {recentBlogs.map((blog) => (
          <DiravCard key={blog.id} padding="sm" className="flex flex-col">
            <div className="p-2 sm:p-4 flex flex-col h-full">
              {/* Category & Read Time */}
              <div className="flex items-center justify-between mb-3">
                <DiravBadge
                  label={blog.category}
                  color={getCategoryColor(blog.category)}
                  textColor="white"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#6B7280]">{blog.readTime}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(blog.id);
                    }}
                    className={`text-lg transition-all ${bookmarkedBlogs.includes(blog.id) ? '' : 'grayscale opacity-50 hover:opacity-75'}`}
                  >
                    🔖
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 
                className="text-base sm:text-lg font-semibold text-[#111827] mb-2 flex-1 cursor-pointer hover:text-[#7C3AED] transition-colors"
                onClick={() => setSelectedBlog(blog)}
              >
                {blog.title}
              </h3>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-[#6B7280] mb-4 line-clamp-2">
                {blog.excerpt}
              </p>

              {/* Read Link */}
              <button
                onClick={() => setSelectedBlog(blog)}
                className="flex items-center gap-1 text-sm font-semibold hover:underline self-start"
                style={{ color: DiravColors.primary }}
              >
                Read More
                <ChevronRightIcon size={16} />
              </button>
            </div>
          </DiravCard>
        ))}
      </div>

      {/* Newsletter Section - hide when embedded */}
      {!embedded && (
        <DiravCard>
          <div className="text-center py-2 sm:py-4">
            {subscribed ? (
              <>
                <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-[#10B981]/20 flex items-center justify-center">
                  <CheckIcon size={28} className="text-[#10B981]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-2">
                  You're Subscribed!
                </h3>
                <p className="text-sm sm:text-base text-[#6B7280]">
                  You'll receive our latest financial tips and opportunities.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-2">
                  Stay Updated
                </h3>
                <p className="text-sm sm:text-base text-[#6B7280] mb-4 max-w-md mx-auto">
                  Get the latest financial tips and student opportunities delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all text-sm sm:text-base"
                  />
                  <DiravButton
                    label="Subscribe"
                    onClick={handleSubscribe}
                  />
                </div>
              </>
            )}
          </div>
        </DiravCard>
      )}

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl shadow-xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <DiravBadge
                label={selectedBlog.category}
                color={getCategoryColor(selectedBlog.category)}
                textColor="white"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(selectedBlog)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ShareIcon size={20} className="text-[#6B7280]" />
                </button>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <CloseIcon size={20} className="text-[#6B7280]" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-[#111827] mb-3">
                {selectedBlog.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-[#6B7280] mb-6">
                <span>By {selectedBlog.author}</span>
                <span>•</span>
                <span>{formatDate(selectedBlog.publishedDate)}</span>
                <span>•</span>
                <span>{selectedBlog.readTime}</span>
              </div>

              <div className="prose prose-sm sm:prose max-w-none">
                <p className="text-[#6B7280] leading-relaxed whitespace-pre-line">
                  {selectedBlog.content}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-100 flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => toggleBookmark(selectedBlog.id)}
                  className={`flex-1 py-3 rounded-xl font-semibold border-2 transition-colors flex items-center justify-center gap-2 ${
                    bookmarkedBlogs.includes(selectedBlog.id)
                      ? 'border-[#7C3AED] bg-[#7C3AED]/5 text-[#7C3AED]'
                      : 'border-gray-200 text-[#6B7280] hover:border-[#7C3AED] hover:text-[#7C3AED]'
                  }`}
                >
                  🔖 {bookmarkedBlogs.includes(selectedBlog.id) ? 'Bookmarked' : 'Bookmark'}
                </button>
                <button
                  onClick={() => handleShare(selectedBlog)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-[#7C3AED] text-white hover:bg-[#8B5CF6] transition-colors flex items-center justify-center gap-2"
                >
                  <ShareIcon size={18} />
                  Share Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogsScreen;
