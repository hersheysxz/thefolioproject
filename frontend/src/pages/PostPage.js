import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Comments from '../components/Comments';
import Reactions from '../components/Reactions';
import '../styles/PostPage.css';

const PostPage = () => {
  const { id } = useParams();
  useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postRes = await API.get(`/posts/${id}`);
        setPost(postRes.data);
      } catch (err) {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="loader">Loading Exhibit...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className='post-view-container'>
      <button onClick={() => navigate('/home')} className='back-btn'>
        ← Back to Gallery
      </button>

      <div className='responsive-post-grid'>
        {/* MAIN EXHIBIT COLUMN */}
        <main className='post-main-content'>
          {post.image && (
            <div className='exhibit-frame'>
              <img 
                src={`http://localhost:5000/uploads/${post.image}`} 
                alt={post.title} 
                className='exhibit-img' 
              />
            </div>
          )}
          
          <div className='post-details'>
            <h1 className='exhibit-title'>{post.title}</h1>
            <p className='exhibit-meta'>
              By <strong>{post.author?.name}</strong> • {new Date(post.createdAt).toLocaleDateString()}
            </p>
            
            <div className='exhibit-body'>
              {post.body.split('\n').map((p, i) => <p key={i}>{p}</p>)}
            </div>

            {/* RESPONSIVE REACTION BAR */}
            <section className='interaction-zone'>
              <Reactions postId={id} initialLikes={post.likes || []} />
            </section>
          </div>
        </main>

        {/* FEEDBACK COLUMN */}
        <aside className='post-sidebar'>
          <div className='sticky-wrapper'>
            <h3 className='sidebar-header'>COMMUNITY FEEDBACK</h3>
            <Comments postId={id} />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostPage;