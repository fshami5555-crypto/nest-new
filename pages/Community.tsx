
import React, { useState, useEffect } from 'react';
import { UserProfile, Post } from '../types';
import { fsGetDocs, fsAddDoc, fsUpdateDoc, arrayUnion, arrayRemove } from '../firebase';
import { Heart, MessageCircle, Send, Share2, MoreHorizontal } from 'lucide-react';

interface CommunityProps {
  user: UserProfile;
}

const Community: React.FC<CommunityProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    const data = await fsGetDocs<Post>("posts");
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim() || loading) return;
    setLoading(true);
    try {
      await fsAddDoc("posts", {
        authorId: user.id,
        authorName: user.name || 'مستخدمة',
        content: newPost,
        likes: [],
        comments: []
      });
      setNewPost('');
      await loadPosts();
    } catch (err) {
      alert("حدث خطأ أثناء النشر");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (post: Post) => {
    const likes = Array.isArray(post.likes) ? post.likes : [];
    const isLiked = likes.includes(user.id);
    
    await fsUpdateDoc("posts", post.id, {
      likes: isLiked ? arrayRemove(user.id) : arrayUnion(user.id)
    });
    loadPosts();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 pb-24">
      <div className="glass p-6 rounded-3xl shadow-sm border border-pink-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">شاركينا تجربتكِ اليوم</h2>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold shrink-0 uppercase">
            {(user?.name || 'ن').charAt(0)}
          </div>
          <div className="flex-1 space-y-3">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="اكتبي منشوراً جديداً..."
              className="w-full bg-pink-50/50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-pink-300 transition-all border border-pink-100"
              rows={3}
            />
            <button
              onClick={handlePost}
              disabled={loading || !newPost.trim()}
              className="bg-pink-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-pink-200 disabled:opacity-50 transition-all float-left"
            >
              {loading ? 'جاري النشر...' : 'نشر'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map(post => {
          const likes = Array.isArray(post.likes) ? post.likes : [];
          const comments = Array.isArray(post.comments) ? post.comments : [];
          const isLiked = likes.includes(user.id);
          
          return (
            <div key={post.id} className="glass p-6 rounded-3xl border border-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm uppercase">
                    {(post.authorName || 'ن').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{post.authorName || 'مشاركة مجهولة'}</h4>
                    <p className="text-[10px] text-gray-400">منذ {new Date(post.timestamp).toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <MoreHorizontal className="text-gray-400 cursor-pointer" />
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</p>

              <div className="flex items-center gap-6 pt-4 border-t border-pink-50">
                <button 
                  onClick={() => handleLike(post)}
                  className={`flex items-center gap-2 text-xs font-bold transition-colors ${isLiked ? 'text-pink-600' : 'text-gray-400'}`}
                >
                  <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                  {likes.length}
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <MessageCircle size={18} />
                  {comments.length}
                </button>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {posts.length === 0 && (
          <div className="text-center p-12 text-gray-400 italic">
            كوني أول من يشارك في المجتمع!
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
