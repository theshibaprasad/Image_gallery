import React, { useState } from 'react'
import './CreatePost.css'

function CreatePost() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_CAPTION_LENGTH = 500;
  const MIN_CAPTION_LENGTH = 3;

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Error: Please select an image file')
        return
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setMessage('Error: Image size must be less than 5MB')
        return
      }

      setImage(file)
      setPreview(URL.createObjectURL(file))
      setMessage('') // Clear any previous errors
    }
  }

  const handleCaptionChange = (e) => {
    const value = e.target.value
    if (value.length <= MAX_CAPTION_LENGTH) {
      setCaption(value)
      setMessage('') // Clear errors when typing
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Client-side validation
    if (!image) {
      setMessage('Error: Please select an image')
      return
    }

    if (!caption.trim()) {
      setMessage('Error: Caption is required')
      return
    }

    if (caption.trim().length < MIN_CAPTION_LENGTH) {
      setMessage(`Error: Caption must be at least ${MIN_CAPTION_LENGTH} characters`)
      return
    }

    setLoading(true)
    setMessage('')
    
    const formData = new FormData()
    formData.append('image', image)
    formData.append('caption', caption.trim())

    try {
      const response = await fetch('http://localhost:3000/createpost', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (response.ok) {
        setMessage(data.message || 'Image uploaded successfully!')
        setImage(null)
        setPreview(null)
        setCaption('')
        document.querySelector('input[type="file"]').value = ''
        
        // Redirect to feed after 2 seconds
        setTimeout(() => {
          window.location.href = '/feed'
        }, 2000)
      } else {
        setMessage(`Error: ${data.error || 'Upload failed'}`)
      }
    } catch (error) {
      setMessage(`Error: ${error.message || 'Network error'}`)
    } finally {
      setLoading(false)
    }
  }

  const captionLength = caption.length
  const isValidCaption = captionLength >= MIN_CAPTION_LENGTH && captionLength <= MAX_CAPTION_LENGTH

  return (
      <div className="create-post-container">
          <h1 className="create-post-title">Create New Post</h1>
          <form onSubmit={handleSubmit} className="create-post-form">
              <div className="form-group">
                <div className="form-label">📸 Upload Image</div>
                <label htmlFor="image" className="file-label">
                  {preview ? '🔄 Change Image' : '+ Choose Image'}
                </label>
                <input 
                  id="image"
                  type="file" 
                  accept='image/*'
                  onChange={handleImageChange}
                  className="file-input"
                  required
                />
                {image && (
                  <p className="file-info">
                    ✓ {image.name} ({(image.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              
              {preview && (
                <div className="image-preview">
                  <img src={preview} alt="Preview" />
                </div>
              )}
              
              <div className="form-group">
                <div className="form-label">✏️ Write a Caption</div>
                <textarea 
                  placeholder='Share your thoughts about this image...'
                  value={caption}
                  onChange={handleCaptionChange}
                  className="caption-input"
                  rows="4"
                  required 
                />
                <div className="caption-counter">
                  <span className={captionLength < MIN_CAPTION_LENGTH || captionLength > MAX_CAPTION_LENGTH ? 'invalid' : 'valid'}>
                    {captionLength}/{MAX_CAPTION_LENGTH} characters
                  </span>
                </div>
              </div>
              
              <button 
                type='submit' 
                className="submit-btn" 
                disabled={loading || !image || !isValidCaption}
              >
                {loading ? '⏳ Uploading...' : '🚀 Upload Post'}
              </button>
          </form>
          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
    </div>
  )
}

export default CreatePost
