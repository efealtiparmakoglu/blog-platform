import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '', tags: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/posts');
    const data = await res.json();
    setPosts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newPost,
        tags: newPost.tags.split(',').map(t => t.trim())
      })
    });
    setNewPost({ title: '', content: '', author: '', tags: '' });
    setShowForm(false);
    fetchPosts();
  };

  return (
    <div className="app">
      <header>
        <h1>📝 Tech Blog</h1>
        <button onClick={() => setShowForm(!showForm)}>{showForm ? 'İptal' : '+ Yeni Yazı'}</button>
      </header>

      {showForm && (
        <form onSubmit={handleSubmit} className="post-form">
          <input placeholder="Başlık" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} required />
          <input placeholder="Yazar" value={newPost.author} onChange={e => setNewPost({...newPost, author: e.target.value})} required />
          <input placeholder="Etiketler (virgülle ayır)" value={newPost.tags} onChange={e => setNewPost({...newPost, tags: e.target.value})} />
          <textarea placeholder="İçerik..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} required rows="5" />
          <button type="submit">Yayınla</button>
        </form>
      )}

      <div className="posts">
        {posts.map(post => (
          <article key={post._id} className="post">
            <h2>{post.title}</h2>
            <div className="meta">
              <span>👤 {post.author}</span>
              <span>📅 {new Date(post.createdAt).toLocaleDateString()}</span>
              <span>❤️ {post.likes}</span>
            </div>
            <p>{post.content.substring(0, 200)}...</p>
            <div className="tags">
              {post.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default App;
