import React from "react";

export default function ExpiredPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-navy text-white">
      <h2 className="text-2xl font-bold mb-4">That was your one glance.</h2>
      <p className="text-gray-400">This link has expired and cannot be used again.</p>
    </div>
  );
}