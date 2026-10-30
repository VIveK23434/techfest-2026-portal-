import React, { useState, useEffect, useRef } from 'react';

const galleryPhotos = [
  {
    id: 1,
    title: 'Hackathon Grand Arena 2025',
    category: 'Hackathon',
    src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    desc: 'Students collaborating during the 24-hour coding sprint.',
  },
  {
    id: 2,
    title: 'Cloud & DevOps Lab Session',
    category: 'Workshop',
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    desc: 'Deploying microservices and monitoring cluster performance.',
  },
  {
    id: 3,
    title: 'Cybersecurity Capture The Flag',
    category: 'CTF',
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    desc: 'Ethical hacking and defense vulnerability analysis.',
  },
  {
    id: 4,
    title: 'Robotics & AI Arena',
    category: 'Expo',
    src: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    desc: 'Autonomous rover trials and neural network demonstrations.',
  },
  {
    id: 5,
    title: 'Valedictory & Awards Ceremony',
    category: 'Cultural',
    src: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    desc: 'Principal presenting championship trophies to winning teams.',
  },
  {
    id: 6,
    title: 'LAN Gaming Finals',
    category: 'Gaming',
    src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    desc: 'High-stakes inter-college esports tournament auditorium.',
  },
];

export default function GalleryPage() {
  const [activePhoto, setActivePhoto] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setActivePhoto(galleryPhotos[index]);
  };

  const closeLightbox = () => {
    setActivePhoto(null);
    stopSlideshow();
  };

  const showNext = () => {
    const nextIdx = (currentIndex + 1) % galleryPhotos.length;
    setCurrentIndex(nextIdx);
    setActivePhoto(galleryPhotos[nextIdx]);
  };

  const showPrev = () => {
    const prevIdx = (currentIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
    setCurrentIndex(prevIdx);
    setActivePhoto(galleryPhotos[prevIdx]);
  };

  const startSlideshow = () => {
    setIsPlaying(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % galleryPhotos.length;
        setActivePhoto(galleryPhotos[next]);
        return next;
      });
    }, 2500);
  };

  const stopSlideshow = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Keyboard navigation (Arrow keys and Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activePhoto) return;
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activePhoto, currentIndex]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>TechFest Photo Gallery</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          High-performance lazy-loaded gallery with responsive lightbox & slideshow controls.
        </p>

        {/* Slideshow button */}
        <div style={{ marginTop: '1rem' }}>
          {!isPlaying ? (
            <button
              onClick={() => {
                if (!activePhoto) openLightbox(0);
                startSlideshow();
              }}
              className="btn-primary"
              style={{ fontSize: '0.9rem' }}
            >
              ▶️ Play Slideshow (Auto 2.5s)
            </button>
          ) : (
            <button onClick={stopSlideshow} className="btn-danger" style={{ fontSize: '0.9rem' }}>
              ⏹️ Stop Slideshow
            </button>
          )}
        </div>
      </div>

      {/* Grid of Optimized Photos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {galleryPhotos.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(index)}
            style={{
              position: 'relative',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <img
              src={photo.src}
              alt={photo.title}
              loading="lazy"
              width="400"
              height="250"
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <div style={{ padding: '0.85rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                {photo.category}
              </div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {photo.title}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius)',
              maxWidth: '850px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                style={{
                  width: '100%',
                  maxHeight: '480px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <button
                onClick={closeLightbox}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{activePhoto.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{activePhoto.desc}</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={showPrev} className="btn-secondary" style={{ padding: '8px 14px' }}>
                  ◀ Prev
                </button>
                <button onClick={showNext} className="btn-secondary" style={{ padding: '8px 14px' }}>
                  Next ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
