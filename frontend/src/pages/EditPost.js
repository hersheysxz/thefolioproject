// frontend/src/pages/EditPostPage.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
const EditPostPage = () => {
 const { id } = useParams();
 const { user } = useAuth();
 const navigate = useNavigate();
 const [title, setTitle] = useState('');
 const [body, setBody] = useState('');
 const [image, setImage] = useState(null);
 const [currentImage, setCurrentImage] = useState('');
 const [error, setError] = useState('');
 const [loading, setLoading] = useState(true);
 useEffect(() => {
 const fetchPost = async () => {
 try {
 const { data } = await API.get(`/posts/${id}`);
 setTitle(data.title);
 setBody(data.body);
 setCurrentImage(data.image || '');
 } catch (err) {
 setError('Post not found.');
 } finally {
 setLoading(false);
 }
 };
 fetchPost();
 }, [id]);
 const handleSubmit = async (e) => {
 e.preventDefault(); setError('');
 const fd = new FormData();
 fd.append('title', title);
 fd.append('body', body);
 if (image) fd.append('image', image);
 try {
 await API.put(`/posts/${id}`, fd);
 navigate(`/posts/${id}`);
 } catch (err) {
 setError(err.response?.data?.message || 'Failed to update post');
 }
 };
 if (loading) return <p>Loading post...</p>;
 return (
 <div className='edit-post-page'>
 <h2>Edit Post</h2>
 {error && <p className='error-msg'>{error}</p>}
 {currentImage && (
 <div className='current-image'>
 <p>Current cover image:</p>
 <img src={`http://localhost:5000/uploads/${currentImage}`}
 alt='Current cover' />
 </div>
 )}
 <form onSubmit={handleSubmit}>
 <input value={title} onChange={e => setTitle(e.target.value)}
 placeholder='Post title' required />
 <textarea value={body} onChange={e => setBody(e.target.value)}
 placeholder='Write your post here...' rows={12} required />
 {user?.role === 'admin' && (
 <div>
 <label>Replace Cover Image (Admin only):</label>
 <input type='file' accept='image/*'
 onChange={e => setImage(e.target.files[0])} />
 </div>
 )}
 <button type='submit'>Update Post</button>
 </form>
 </div>
 );
};
export default EditPostPage;
