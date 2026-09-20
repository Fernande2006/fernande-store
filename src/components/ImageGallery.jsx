import { useEffect, useState } from "react";

const SWIPE_THRESHOLD = 40;

export default function ImageGallery({ images = [], alt = "", selectedImage = null }) {
  const [index, setIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
  if (!selectedImage) return;
  const normalize = (s) => decodeURIComponent(s).trim();
  const found = images.findIndex((img) => normalize(img) === normalize(selectedImage));
  if (found !== -1) {
    setIndex(found);
  } else if (import.meta.env.DEV) {
    console.warn(
      "ImageGallery : l'image liée à cette option est introuvable dans `images`.",
      { selectedImage, images }
    );
  }
}, [selectedImage, images]);

  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  const goTo = (i) => setIndex((i + images.length) % images.length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (delta > SWIPE_THRESHOLD) prev();
    else if (delta < -SWIPE_THRESHOLD) next();
    setTouchStartX(null);
  };

  return (
    <div>
      <div
        className="aspect-[4/5] bg-kraft/40 rounded-sm overflow-hidden relative select-none"
        onTouchStart={hasMultiple ? handleTouchStart : undefined}
        onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
      >
        {hasImages ? (
          <img
            src={images[index]}
            alt={`${alt}${hasMultiple ? ` — photo ${index + 1}` : ""}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-xs tracking-[0.15em] text-ink-soft/60 uppercase">
              Photo à venir
            </span>
          </div>
        )}

        {hasMultiple && (
          <>
            <button
              onClick={prev}
              aria-label="Photo précédente"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/85 text-ink flex items-center justify-center hover:bg-cream transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Photo suivante"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/85 text-ink flex items-center justify-center hover:bg-cream transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Aller à la photo ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === index ? "bg-route" : "bg-ink/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="hidden sm:flex gap-2 mt-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-16 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                i === index ? "border-route" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`Aller à la photo ${i + 1}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
