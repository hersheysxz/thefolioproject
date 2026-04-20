import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

import art5 from "../assets/art5.jpg";
import art7 from "../assets/art7.jpg";
import junji from "../assets/junji.jpg";
import art17 from "../assets/art17.jpg";
import art2 from "../assets/art2.jpg";
import art3 from "../assets/art3.jpg";
import art14 from "../assets/art14.jpg";
import art6 from "../assets/art6.jpg";
import art20 from "../assets/art20.jpg";
import art12 from "../assets/art12.jpg";
import art11 from "../assets/art11.jpg";
import art10 from "../assets/art10.jpg";
import art18 from "../assets/art18.jpg";
import art19 from "../assets/art19.jpg";
import art9 from "../assets/art9.jpg";
import art24 from "../assets/art24.jpg";
import art21 from "../assets/art21.jpg";

function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Failed to load posts:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <main className="main-wrapper">
        <section className="hero-poster">
          <div className="grid-layer"></div>
          <div className="poster-content">
            <div className="poster-visuals">
              <div className="poster-card">
                <img src={art5} alt="Featured Art" />
              </div>
              <div className="poster-card">
                <img src={art7} alt="Collage" />
              </div>
            </div>
            <div className="poster-text">
              <h1 className="poster-title">
                ALMOST <br /> REAL
              </h1>
              <p className="poster-quote">
                "ART IS THE DOORWAY TO WHAT REALITY REFUSES TO SHOW." -{" "}
                <span>UNKNOWN</span>
              </p>
            </div>
          </div>
        </section>

        <div className="content-limit">
          <section className="intro-box">
            <div className="intro-header">
              <h2 className="section-heading">Art That Feels Almost Real</h2>
            </div>
            <div className="intro-body">
              <p className="main-description">
                Welcome to <strong>Almost Real</strong>, a personal art portfolio
                exploring surreal emotions and visual storytelling that blurs
                the line between imagination and reality.
              </p>

              <div className="highlights-grid">
                <div className="h-card">
                  <span className="h-num">01</span>
                  <p>Surreal visual art</p>
                </div>
                <div className="h-card">
                  <span className="h-num">02</span>
                  <p>Paintings</p>
                </div>
                <div className="h-card">
                  <span className="h-num">03</span>
                  <p>Artistic journey</p>
                </div>
                <div className="h-card">
                  <span className="h-num">04</span>
                  <p>Digital artworks</p>
                </div>
              </div>
            </div>
          </section>

          <section className="author-section">
            <div className="author-container">
              <div className="author-content">
                <div className="author-text">
                  <div className="author-label">Featured Inspiration</div>
                  <h2 className="section-heading">My Favorite Author</h2>
                  <div className="heading-line"></div>
                  <p>
                    I am fascinated by Junji Ito's work for its visual power and
                    bizarre concepts that remain grounded in normal life.
                  </p>
                  <blockquote className="neutral-quote">
                    "Many of his tales revolve around fears, obsessions, and
                    phobias."
                  </blockquote>
                </div>

                <div className="author-image-box">
                  <img src={junji} alt="Junji Ito" className="author-img" />
                  <p className="img-subtext">The Master of Horror Manga</p>
                </div>
              </div>
            </div>
          </section>

          <section className="gallery-section">
            <div className="gallery-container">
              <div className="gallery-header">
                <h2 className="section-heading">Art Gallery</h2>
                <p className="gallery-count">
                  Inspiration: Junji Ito and Vincent Van Gogh
                </p>
                <div className="heading-line"></div>
              </div>

              <div className="gallery-grid">
                {[
                  art17,
                  art2,
                  art3,
                  art14,
                  art5,
                  art6,
                  art7,
                  art20,
                  art12,
                  art11,
                  art10,
                  art18,
                  art19,
                  art9,
                  art24,
                  art21,
                ].map((img, index) => (
                  <div key={index} className="art-frame">
                    <img src={img} alt="Gallery item" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="posts-section">
            <div className="latest-posts-header">
              <div className="latest-posts-copy">
                <span className="latest-posts-kicker">Community Feed</span>
                <h2>Latest Posts</h2>
                <p>Explore community posts and artistic insights.</p>
              </div>

              {user && (
                <Link to="/write" className="latest-posts-cta">
                  + Write a Post
                </Link>
              )}
            </div>

            {loading && <p>Loading exhibits...</p>}
            {!loading && posts.length === 0 && (
              <p>No posts yet. Start the conversation!</p>
            )}

            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post._id} className="post-card">
                  {post.image && (
                    <div className="post-card-img">
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.image}`}
                        alt={post.title}
                      />
                    </div>
                  )}

                  <div className="post-card-body">
                    <h3>
                      <Link to={`/posts/${post._id}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p>{post.body.substring(0, 120)}...</p>

                    <div className="post-card-footer">
                      <div className="post-meta">
                        By{" "}
                        <strong>
                          {post.author?.name || "Unknown"}
                        </strong>
                        <br />
                        <span>
                          {new Date(
                            post.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="latest-post-card-bottom">
                        <div className="post-interactions">
                          <span className="stat-item">
                            ❤️ {post.likes || 0}
                          </span>
                          <span className="stat-item">
                            💬 {post.commentsCount || 0}
                          </span>
                        </div>

                        <Link
                          to={`/posts/${post._id}`}
                          className="latest-post-view-btn"
                        >
                          View Post
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <p>
          Contact: rachelregacho645@gmail.com | Instagram:
          @almostreal
        </p>
        <p>Copyright 2026 Almost Real Portfolio</p>
      </footer>
    </div>
  );
}

export default HomePage;