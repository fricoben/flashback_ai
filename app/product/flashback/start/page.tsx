"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  id: string;
  name: string;
  url: string;
  path: string;
}

type Step = "upload" | "reorder";

const MIN_PHOTOS = 5;
const MAX_PHOTOS = 10;

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
  const [step, setStep] = useState<Step>("upload");
  
  // Drag state for reordering
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const touchStartY = useRef<number>(0);
  const touchStartIndex = useRef<number | null>(null);

  // Check auth and load data
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/product/flashback");
        return;
      }
      
      setUser(user);

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
        router.push("/product/flashback");
        return;
      }

      const activeOrder = orders[0] as Order;
      setOrder(activeOrder);

      if (activeOrder.films_used >= activeOrder.films_total) {
        router.push("/product/flashback");
        return;
      }

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
        await loadPhotos(film.id);
      } else {
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

  // Auto-advance to reorder when reaching max photos
  useEffect(() => {
    if (uploadedPhotos.length >= MAX_PHOTOS && step === "upload") {
      setStep("reorder");
    }
  }, [uploadedPhotos.length, step]);

  async function loadPhotos(filmId: string) {
    const { data: files, error } = await supabase.storage
      .from("film-photos")
      .list(filmId);

    if (error) {
      console.error("Error loading photos:", error);
      return;
    }

    if (files && files.length > 0) {
      // Generate signed URLs for each photo (valid for 2 hours)
      const photosWithUrls = await Promise.all(
        files.map(async (file, index) => {
          const filePath = `${filmId}/${file.name}`;
          const { data } = await supabase.storage
            .from("film-photos")
            .createSignedUrl(filePath, 7200); // 2 hours

          return {
            id: `${filmId}-${file.name}-${index}`,
            name: file.name,
            path: filePath,
            url: data?.signedUrl || "",
          };
        })
      );
      setUploadedPhotos(photosWithUrls.filter((p) => p.url)); // Only keep photos with valid URLs
    }
  }

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || !currentFilm || !user) return;

    // Calculate how many we can still upload
    const remainingSlots = MAX_PHOTOS - uploadedPhotos.length;
    if (remainingSlots <= 0) {
      setStep("reorder");
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    setUploading(true);
    const newPhotos: UploadedPhoto[] = [];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
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

      // Generate signed URL (valid for 2 hours)
      const { data: signedUrlData } = await supabase.storage
        .from("film-photos")
        .createSignedUrl(filePath, 7200); // 2 hours

      if (signedUrlData?.signedUrl) {
        newPhotos.push({
          id: `${currentFilm.id}-${fileName}-${Date.now()}-${i}`,
          name: fileName,
          path: filePath,
          url: signedUrlData.signedUrl,
        });
      }
    }

    const updatedPhotos = [...uploadedPhotos, ...newPhotos];
    setUploadedPhotos(updatedPhotos);

    await supabase
      .from("films")
      .update({
        status: "uploading",
        photos_count: updatedPhotos.length,
      })
      .eq("id", currentFilm.id);

    setUploading(false);

    // Auto-advance if we hit max
    if (updatedPhotos.length >= MAX_PHOTOS) {
      setStep("reorder");
    }
  }, [currentFilm, user, supabase, uploadedPhotos]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (step === "upload") {
      handleUpload(e.dataTransfer.files);
    }
  }, [handleUpload, step]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(e.target.files);
  }, [handleUpload]);

  async function deletePhoto(photo: UploadedPhoto) {
    const { error } = await supabase.storage
      .from("film-photos")
      .remove([photo.path]);

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    setUploadedPhotos((prev) => prev.filter((p) => p.id !== photo.id));

    if (currentFilm) {
      await supabase
        .from("films")
        .update({ photos_count: uploadedPhotos.length - 1 })
        .eq("id", currentFilm.id);
    }
  }

  // Drag and drop reordering handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newPhotos = [...uploadedPhotos];
      const [draggedItem] = newPhotos.splice(draggedIndex, 1);
      newPhotos.splice(dragOverIndex, 0, draggedItem);
      setUploadedPhotos(newPhotos);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch handlers for mobile reordering
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartIndex.current = index;
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartIndex.current === null) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    const itemHeight = 80; // Approximate height of each item
    const indexDiff = Math.round(diff / itemHeight);
    const newIndex = Math.max(0, Math.min(uploadedPhotos.length - 1, touchStartIndex.current + indexDiff));
    
    if (newIndex !== dragOverIndex) {
      setDragOverIndex(newIndex);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartIndex.current !== null && dragOverIndex !== null && touchStartIndex.current !== dragOverIndex) {
      const newPhotos = [...uploadedPhotos];
      const [draggedItem] = newPhotos.splice(touchStartIndex.current, 1);
      newPhotos.splice(dragOverIndex, 0, draggedItem);
      setUploadedPhotos(newPhotos);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    touchStartIndex.current = null;
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= uploadedPhotos.length) return;
    const newPhotos = [...uploadedPhotos];
    const [movedItem] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedItem);
    setUploadedPhotos(newPhotos);
  };

  const [submitting, setSubmitting] = useState(false);

  async function submitFilm() {
    if (!currentFilm || uploadedPhotos.length < MIN_PHOTOS || submitting) return;

    setSubmitting(true);
    console.log("=== SUBMIT FILM START ===");
    console.log("Film ID:", currentFilm.id);
    console.log("Photos to rename:", uploadedPhotos.length);

    try {
      // Rename photos to their order position (1.jpg, 2.jpg, etc.)
      for (let i = 0; i < uploadedPhotos.length; i++) {
        const photo = uploadedPhotos[i];
        const extension = photo.name.split(".").pop() || "jpg";
        const newFileName = `${i + 1}.${extension}`;
        const newPath = `${currentFilm.id}/${newFileName}`;

        console.log(`[Photo ${i + 1}] Current path: ${photo.path}`);
        console.log(`[Photo ${i + 1}] New path: ${newPath}`);

        // Skip if already named correctly
        if (photo.path === newPath) {
          console.log(`[Photo ${i + 1}] Already named correctly, skipping`);
          continue;
        }

        // Move/rename the file
        console.log(`[Photo ${i + 1}] Attempting move...`);
        const { data: moveData, error: moveError } = await supabase.storage
          .from("film-photos")
          .move(photo.path, newPath);

        if (moveError) {
          console.error(`[Photo ${i + 1}] MOVE FAILED:`, moveError);
          console.error(`[Photo ${i + 1}] Error details:`, JSON.stringify(moveError, null, 2));
          // Continue with other photos even if one fails
        } else {
          console.log(`[Photo ${i + 1}] Move SUCCESS`, moveData);
        }
      }
      console.log("=== RENAME COMPLETE ===");

      // Update film status
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

      // Trigger video generation on Fly.io
      try {
        const generateResponse = await fetch("/api/generate-film", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ film_id: currentFilm.id }),
        });

        if (!generateResponse.ok) {
          console.error("Failed to trigger video generation");
        } else {
          console.log("Video generation started");
        }
      } catch (genError) {
        console.error("Error triggering video generation:", genError);
        // Don't block the user flow if generation trigger fails
      }

      router.push("/product/flashback/submitted");
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitting(false);
    }
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
            {step === "upload" ? "Upload your photos" : "Arrange your story"}
          </h1>
          
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            {step === "upload" 
              ? `Select ${MIN_PHOTOS}-${MAX_PHOTOS} photos to create your ~40 second film.`
              : "Drag to reorder. First photo appears first in your film."
            }
          </p>
        </div>

        {/* Step indicator */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setStep("upload")}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              step === "upload"
                ? "bg-[#E8C547] text-black"
                : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-xs">1</span>
            Upload
          </button>
          <div className="h-px w-8 bg-white/20" />
          <button
            onClick={() => uploadedPhotos.length >= MIN_PHOTOS && setStep("reorder")}
            disabled={uploadedPhotos.length < MIN_PHOTOS}
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
              step === "reorder"
                ? "bg-[#E8C547] text-black"
                : uploadedPhotos.length >= MIN_PHOTOS
                  ? "bg-white/10 text-white/60 hover:bg-white/20"
                  : "cursor-not-allowed bg-white/5 text-white/30"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-xs">2</span>
            Arrange
          </button>
        </div>

        {/* STEP 1: Upload */}
        {step === "upload" && (
          <>
            {/* Progress bar */}
            <div className="mt-10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">{uploadedPhotos.length} / {MAX_PHOTOS} photos</span>
                <span className={uploadedPhotos.length >= MIN_PHOTOS ? "text-green-500" : "text-white/40"}>
                  {uploadedPhotos.length >= MIN_PHOTOS ? "✓ Minimum reached" : `${MIN_PHOTOS - uploadedPhotos.length} more needed`}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div 
                  className="h-full rounded-full bg-[#E8C547] transition-all duration-300"
                  style={{ width: `${(uploadedPhotos.length / MAX_PHOTOS) * 100}%` }}
                />
              </div>
            </div>

            {/* Upload area */}
            <div className="mt-8">
              <div 
                className={`rounded-3xl border-2 border-dashed bg-white/5 p-8 text-center transition-all sm:p-12 ${
                  uploadedPhotos.length >= MAX_PHOTOS 
                    ? "border-white/10 opacity-50" 
                    : "border-white/20 hover:border-[#E8C547]/40 hover:bg-white/10"
                }`}
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
                  {uploading ? "Uploading..." : uploadedPhotos.length >= MAX_PHOTOS ? "Maximum reached" : "Drop your photos here"}
                </h3>
                <p className="mt-2 text-white/40">
                  {uploadedPhotos.length >= MAX_PHOTOS 
                    ? "Proceed to arrange your photos"
                    : "or click to browse"
                  }
                </p>
                
                {uploadedPhotos.length < MAX_PHOTOS && (
                  <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full bg-[#E8C547] px-8 py-3 font-semibold text-black transition-colors hover:bg-[#d4b33d]">
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
                )}
                
                <p className="mt-4 text-xs text-white/30">
                  JPG, PNG, WebP, HEIC • Max 20MB per photo
                </p>
              </div>
            </div>

            {/* Uploaded photos preview (smaller, horizontal scroll on mobile) */}
            {uploadedPhotos.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-sm font-medium text-white/60">Uploaded photos</h3>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {uploadedPhotos.map((photo) => (
                    <div key={photo.id} className="group relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                      <img
                        src={photo.url}
                        alt={photo.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => deletePhoto(photo)}
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next step button */}
            {uploadedPhotos.length >= MIN_PHOTOS && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setStep("reorder")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8C547] px-10 py-4 text-lg font-semibold text-black transition-all hover:bg-[#d4b33d]"
                >
                  Next: Arrange Photos
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: Reorder */}
        {step === "reorder" && (
          <>
            {/* Reorderable list */}
            <div className="mt-8 space-y-3">
              {uploadedPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, index)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`flex items-center gap-4 rounded-2xl border bg-white/5 p-3 transition-all ${
                    draggedIndex === index
                      ? "scale-105 border-[#E8C547] opacity-80 shadow-lg"
                      : dragOverIndex === index
                        ? "border-[#E8C547]/50 bg-[#E8C547]/10"
                        : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Order number */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#E8C547]/20 text-sm font-bold text-[#E8C547]">
                    {index + 1}
                  </div>

                  {/* Photo thumbnail */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/10">
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Mobile: Arrow buttons */}
                  <div className="flex items-center gap-1 sm:hidden">
                    <button
                      onClick={() => movePhoto(index, index - 1)}
                      disabled={index === 0}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => movePhoto(index, index + 1)}
                      disabled={index === uploadedPhotos.length - 1}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => deletePhoto(photo)}
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {/* Drag handle - Desktop only, on the right */}
                  <div className="hidden cursor-grab items-center justify-center text-white/30 active:cursor-grabbing sm:flex">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM14 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning if below minimum after deletions */}
            {uploadedPhotos.length < MIN_PHOTOS && (
              <div className="mt-6 rounded-xl bg-red-500/10 p-4 text-center">
                <p className="text-red-400">
                  You need at least {MIN_PHOTOS} photos. Add {MIN_PHOTOS - uploadedPhotos.length} more.
                </p>
                <button
                  onClick={() => setStep("upload")}
                  className="mt-3 text-sm text-[#E8C547] hover:underline"
                >
                  ← Back to upload
                </button>
              </div>
            )}

            {/* Submit button */}
            {uploadedPhotos.length >= MIN_PHOTOS && (
              <div className="mt-10 text-center">
                <button
                  onClick={submitFilm}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8C547] px-12 py-4 text-lg font-semibold text-black transition-all hover:bg-[#d4b33d] hover:shadow-lg hover:shadow-[#E8C547]/25 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      Preparing your film...
                    </>
                  ) : (
                    <>
                      Create My Film
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                      </svg>
                    </>
                  )}
                </button>
                <p className="mt-3 text-sm text-white/40">
                  {submitting 
                    ? "Organizing your photos in order..."
                    : `Your ${uploadedPhotos.length}-photo film will be sent by email in under 1 hour`
                  }
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer nav */}
        <div className="mt-16 flex items-center justify-between border-t border-white/10 pt-8">
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
