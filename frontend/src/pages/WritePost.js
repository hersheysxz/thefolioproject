import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../styles/WritePost.css";

const WritePost = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("body", body.trim());
    if (image) formData.append("image", image);

    try {
      const { data } = await API.post("/posts", formData);
      navigate(`/posts/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed. Please try again.");
      console.error("Submission failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="write-post-page">
      <div className="write-post-shell">
        <aside className="write-post-aside">
          <span className="write-post-kicker">Studio Draft</span>
          <h1>Shape your next gallery post.</h1>
          <p>
            Build a polished post with a strong title, a clear artist note, and an
            optional cover image before it goes live to the community.
          </p>

          <div className="write-post-tips">
            <div className="tip-card">
              <strong>Title</strong>
              <span>Keep it short, memorable, and exhibition-ready.</span>
            </div>
            <div className="tip-card">
              <strong>Story</strong>
              <span>Share process, references, feeling, or the idea behind the piece.</span>
            </div>
            <div className="tip-card">
              <strong>Visual</strong>
              <span>Add an image to help the post stand out in the gallery feed.</span>
            </div>
          </div>
        </aside>

        <div className="write-post-panel">
          <header className="write-post-header">
            <div>
              <p className="write-post-eyebrow">Create Post</p>
              <h2>Publish to Almost Real</h2>
            </div>
            <div className="write-post-meta">
              <span>{title.trim().length} title chars</span>
              <span>{body.trim().length} body chars</span>
            </div>
          </header>

          {error ? <div className="write-post-error">{error}</div> : null}

          <form onSubmit={handleSubmit} className="write-post-form">
            <label className="field-group">
              <span>Exhibit Title</span>
              <input
                type="text"
                placeholder="Name your piece or post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label className="field-group">
              <span>Artist Note</span>
              <textarea
                placeholder="Describe the work, the mood, the process, or the inspiration behind it"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                required
              />
            </label>

            <div className="write-post-grid">
              <div className="field-group">
                <span>Cover Image Preview</span>
                <div className="preview-card">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Selected preview" className="preview-image" />
                  ) : (
                    <div className="preview-placeholder">
                      Your selected image will appear here.
                    </div>
                  )}
                </div>
                <label className="upload-box" htmlFor="write-post-image">
                  <input
                    id="write-post-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                  />
                  <strong>{image ? image.name : "Choose image"}</strong>
                  <small>PNG, JPG, or any browser-supported image format</small>
                </label>
              </div>

              <div className="preview-card">
                <span>View Post</span>
                <article className="post-preview-card">
                  <div className="post-preview-content">
                    <div className="post-preview-meta">
                      <strong>{user?.name || "Artist"}</strong>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <h3>{title.trim() || "Your post title will appear here"}</h3>
                    <p>
                      {body.trim()
                        ? body.trim().slice(0, 220)
                        : "Your artist note preview will appear here as you type."}
                      {body.trim().length > 220 ? "..." : ""}
                    </p>
                    <div className="post-preview-stats">
                      <span>❤️ 0</span>
                      <span>💬 0</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div className="write-post-actions">
              <button type="button" className="ghost-button" onClick={() => navigate("/home")}>
                Cancel
              </button>
              <button type="submit" className="publish-button" disabled={submitting}>
                {submitting ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default WritePost;
