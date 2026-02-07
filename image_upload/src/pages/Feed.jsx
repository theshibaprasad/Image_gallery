import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Feed.css'

function Feed() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/getposts")
                setPosts(response.data.data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])
    
  return (
    <div className="feed-container">
          <h1 className="feed-title">Image Feed</h1>
          {loading ? (
              <p>Loading...</p>
          ) : posts.length > 0 ? (
              <div className="feed-grid">
                  {posts.map((post) => (
                      <div key={post._id} className="post-card">
                          <img src={post.image} alt={post.caption} className="post-image" />
                          <div className="post-caption">
                              <p>{post.caption}</p>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
              <p className="no-posts">No posts yet</p>
          )}
    </div>
  )
}

export default Feed
