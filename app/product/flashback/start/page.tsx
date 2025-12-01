"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Order {
  id: string;
  plan: string;
  films_total: number;
  films_used: number;
  status: string;
}

interface Film {
  id: string;
  order_id: string;
  status: string;
  photos_count: number;
}

interface UploadedPhoto {
  name: string;
  url: string;
  path: string;
}

export default function FlashbackStartPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check auth and load data
  useEffect(() => {
    async function init() {
      // Check auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/product/flashback");
        return;
      }
      
      setUser(user);

      // Fetch user's active order
      const { data: orders, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1);

      if (orderError) {
        console.error("Error fetching orders:", orderError);
        setError("Failed to load your order");
        setLoading(false);
        return;
      }

      if (!orders || orders.length === 0) {
        // No active order - redirect to buy
        router.push("/product/flashback");
        return;
      }

      const activeOrder = orders[0] as Order;
      setOrder(activeOrder);

      // Check if user has films remaining
      if (activeOrder.films_used >= activeOrder.films_total) {
        router.push("/product/flashback");
        return;
      }

      // Check for existing in-progress film
      const { data: films } = await supabase
        .from("films")
        .select("*")
        .eq("user_id", user.id)
        .eq("order_id", activeOrder.id)
        .in("status", ["pending_upload", "uploading"])
        .order("created_at", { ascending: false })
        .limit(1);

      if (films && films.length > 0) {
        const film = films[0] as Film;
        setCurrentFilm(film);
        
        // Load existing photos for this film
        await loadPhotos(film.id);
      } else {
        // Create new film
        const { data: newFilm, error: filmError } = await supabase
          .from("films")
          .insert({
            order_id: activeOrder.id,
            user_id: user.id,
            status: "pending_upload",
          })
          .select()
          .single();

        if (filmError) {
          console.error("Error creating film:", filmError);
          setError("Failed to start new film");
        } else {
          setCurrentFilm(newFilm as Film);
        }
      }

      setLoading(false);
    }

    init();
  }, [router, supabase]);

  // Load photos from storage
  async function loadPhotos(filmId: string) {
    const { data: files, error } = await supabase.storage
      .from("film-photos")
      .list(filmId);

    if (error) {
      console.error("Error loading photos:", error);
      return;
    }

    if (files && files.length > 0) {
      const photos = files.map((file) => ({
        name: file.name,
        path: `${filmId}/${file.name}`,
        url: supabase.storage.from("film-photos").getPublicUrl(`${filmId}/${file.name}`).data.publicUrl,
      }));
      setUploadedPhotos(photos);
    }
  }

  // Handle file upload
  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || !currentFilm || !user) return;

    setUploading(true);
    const newPhotos: UploadedPhoto[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${i}.${fileExt}`;
      const filePath = `${currentFilm.id}/${fileName}`;

      const { error } = await supabase.storage
        .from("film-photos")
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("film-photos")
        .getPublicUrl(filePath);

      newPhotos.push({
        name: fileName,
        path: filePath,
        url: publicUrl,
      });
    }

    setUploadedPhotos((prev) => [...prev, ...newPhotos]);

    // Update film status and photo count
    await supabase
      .from("films")
      .update({
        status: "uploading",
        photos_count: uploadedPhotos.length + newPhotos.length,
      })
      .eq("id", currentFilm.id);

    setUploading(false);
  }, [currentFilm, user, supabase, uploadedPhotos.length]);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files);
  }, [handleUpload]);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files);
  }, [handleUpload]);

  // Delete photo
  async function deletePhoto(photo: UploadedPhoto) {
    const { error } = await supabase.storage
      .from("film-photos")
      .remove([photo.path]);

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    setUploadedPhotos((prev) => prev.filter((p) => p.path !== photo.path));

    // Update photo count
    if (currentFilm) {
      await supabase
        .from("films")
        .update({ photos_count: uploadedPhotos.length - 1 })
        .eq("id", currentFilm.id);
    }
  }

  // Submit for processing
  async function submitFilm() {
    if (!currentFilm || uploadedPhotos.length < 5) return;

    await supabase
      .from("films")
      .update({
        status: "processing",
        photos_count: uploadedPhotos.length,
      })
      .eq("id", currentFilm.id);

    // Update order films_used
    if (order) {
      await supabase
        .from("orders")
        .update({ films_used: order.films_used + 1 })
        .eq("id", order.id);
    }

    // Redirect to confirmation or dashboard
    router.push("/product/flashback/submitted");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#E8C547]" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">
        <div className="max-w-md text-center">
          <p className="text-red-500">{error}</p>
          <Link href="/product/flashback" className="mt-4 text-[#E8C547] hover:underline">
            Go back
          </Link>
        </div>
      </main>
    );
  }

  const filmsRemaining = (order?.films_total || 0) - (order?.films_used || 0);

  return (
    <main className="min-h-screen bg-black">
      {/* Top gradient */}
      <div 
        className="pointer-events-none fixed inset-x-0 top-0 z-[5] h-32"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#E8C547]/10 px-4 py-2 text-sm text-[#E8C547]">
            <span className="h-2 w-2 rounded-full bg-[#E8C547]" />
            {filmsRemaining} {filmsRemaining === 1 ? "film" : "films"} remaining
          </div>
          
          <h1 className="font-cormorant text-4xl font-light italic text-white sm:text-5xl lg:text-6xl">
            Let&apos;s create your film
          </h1>
          
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            Upload photos from different stages of life. The more variety, the richer your story becomes.
          </p>
        </div>

        {/* Timeline stages */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-white/40">
            Suggested photo categories
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { stage: "Childhood", years: "0-12 years", icon: "👶" },
              { stage: "Youth", years: "13-25 years", icon: "🎓" },
              { stage: "Adulthood", years: "26-50 years", icon: "💼" },
              { stage: "Golden Years", years: "50+ years", icon: "🌟" },
            ].map((item) => (
              <div
                key={item.stage}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-[#E8C547]/30 hover:bg-white/10"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-4 font-medium text-white">{item.stage}</h3>
                <p className="mt-1 text-sm text-white/40">{item.years}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload area */}
        <div className="mt-16">
          <div 
            className="rounded-3xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center transition-all hover:border-[#E8C547]/40 hover:bg-white/10"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8C547]/10">
              {uploading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#E8C547]/20 border-t-[#E8C547]" />
              ) : (
                <svg className="h-8 w-8 text-[#E8C547]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            
            <h3 className="font-cormorant text-2xl font-light text-white">
              {uploading ? "Uploading..." : "Drop your photos here"}
            </h3>
            <p className="mt-2 text-white/40">
              or click to browse (15-50 photos recommended)
            </p>
            
            <label className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-[#E8C547] px-8 py-3 font-semibold text-black transition-colors hover:bg-[#d4b33d]">
              Select Photos
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
            
            <p className="mt-4 text-xs text-white/30">
              Supports JPG, PNG, WebP, HEIC • Max 20MB per photo
            </p>
          </div>
        </div>

        {/* Uploaded photos grid */}
        {uploadedPhotos.length > 0 && (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">
                Uploaded photos ({uploadedPhotos.length})
              </h3>
              <span className={`text-sm ${uploadedPhotos.length >= 15 ? "text-green-500" : "text-white/40"}`}>
                {uploadedPhotos.length >= 15 ? "✓ Minimum reached" : `${15 - uploadedPhotos.length} more needed`}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {uploadedPhotos.map((photo) => (
                <div key={photo.path} className="group relative aspect-square overflow-hidden rounded-lg bg-white/5">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => deletePhoto(photo)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit button */}
        {uploadedPhotos.length >= 5 && (
          <div className="mt-12 text-center">
            <button
              onClick={submitFilm}
              disabled={uploadedPhotos.length < 15}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8C547] px-12 py-4 text-lg font-semibold text-black transition-all hover:bg-[#d4b33d] hover:shadow-lg hover:shadow-[#E8C547]/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create My Film
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            {uploadedPhotos.length < 15 && (
              <p className="mt-3 text-sm text-white/40">
                Add at least {15 - uploadedPhotos.length} more photos to continue
              </p>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-sm font-medium uppercase tracking-wider text-white/40">Tips for the best film</h3>
          <ul className="mt-4 space-y-3 text-white/60">
            <li className="flex items-start gap-3">
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-[#E8C547]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Include photos from different life stages for a richer narrative
            </li>
            <li className="flex items-start gap-3">
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-[#E8C547]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Mix candid shots with milestone moments (birthdays, weddings, graduations)
            </li>
            <li className="flex items-start gap-3">
              <svg className="mt-1 h-4 w-4 flex-shrink-0 text-[#E8C547]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Don&apos;t worry about photo quality — we enhance old and faded images
            </li>
          </ul>
        </div>

        {/* Footer nav */}
        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8">
          <Link 
            href="/product/flashback" 
            className="text-sm text-white/40 transition-colors hover:text-white"
          >
            ← Back to product
          </Link>
          <p className="text-sm text-white/40">
            Questions? <a href="mailto:contact@movila.io" className="text-[#E8C547] hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </main>
  );
}
