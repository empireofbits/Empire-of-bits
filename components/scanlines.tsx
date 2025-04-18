"use client";

export function Scanlines() {
  return (
    <div className="scanlines pointer-events-none fixed inset-0 z-50">
      <div className="scanline"></div>
      <div className="noise"></div>
      <div className="flicker"></div>
    </div>
  );
}
