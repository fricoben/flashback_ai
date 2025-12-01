"use client";

import { useEffect, useState } from "react";
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
  created_at: string;
}

interface Film {
  id: string;
  order_id: string;
  status: string;
  photos_count: number;
  created_at: string;
}

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/product/flashback");
        return;
      }
      
      setUser(user);

      // Fetch all orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData) {
        setOrders(ordersData as Order[]);
      }

      // Fetch all films
      const { data: filmsData } = await supabase
        .from("films")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filmsData) {
        setFilms(filmsData as Film[]);
      }

      setLoading(false);
    }

    loadAccount();
  }, [router, supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#E8C547]" />
      </main>
    );
  }

  const activeOrders = orders.filter(o => o.status === "active");
  const totalFilmsAvailable = activeOrders.reduce((sum, o) => sum + (o.films_total - o.films_used), 0);
  
  // Get only the most recent in-progress film per order
  const allInProgressFilms = films.filter(f => ["pending_upload", "uploading"].includes(f.status));
  const inProgressFilms = Object.values(
    allInProgressFilms.reduce((acc, film) => {
      // Since films are ordered by created_at desc, first one per order_id is most recent
      if (!acc[film.order_id]) {
        acc[film.order_id] = film;
      }
      return acc;
    }, {} as Record<string, Film>)
  );
  
  const processingFilms = films.filter(f => f.status === "processing");
  const completedFilms = films.filter(f => f.status === "completed");

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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-cormorant text-4xl font-light italic text-white sm:text-5xl">
              My Account
            </h1>
            <p className="mt-2 text-white/60">{user?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-3xl font-bold text-[#E8C547]">{totalFilmsAvailable}</p>
            <p className="mt-1 text-sm text-white/60">Films Available</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-3xl font-bold text-white">{processingFilms.length}</p>
            <p className="mt-1 text-sm text-white/60">Processing</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-3xl font-bold text-white">{completedFilms.length}</p>
            <p className="mt-1 text-sm text-white/60">Completed</p>
          </div>
        </div>

        {/* In Progress Films */}
        {inProgressFilms.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-lg font-medium text-white">Continue Creating</h2>
            <div className="space-y-4">
              {inProgressFilms.map((film) => (
                <Link
                  key={film.id}
                  href="/product/flashback/start"
                  className="flex items-center justify-between rounded-2xl border border-[#E8C547]/30 bg-[#E8C547]/10 p-5 transition-all hover:border-[#E8C547]/50 hover:bg-[#E8C547]/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8C547]/20">
                      <svg className="h-6 w-6 text-[#E8C547]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Film in progress</p>
                      <p className="text-sm text-white/60">{film.photos_count} photos uploaded</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#E8C547]">
                    <span className="text-sm font-medium">Continue</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Start New Film CTA */}
        {totalFilmsAvailable > 0 && inProgressFilms.length === 0 && (
          <div className="mt-12">
            <Link
              href="/product/flashback/start"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#E8C547] p-6 text-lg font-semibold text-black transition-all hover:bg-[#d4b33d]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Film
            </Link>
          </div>
        )}

        {/* Processing Films */}
        {processingFilms.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-lg font-medium text-white">Processing</h2>
            <div className="space-y-4">
              {processingFilms.map((film) => (
                <div
                  key={film.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Film processing</p>
                      <p className="text-sm text-white/60">{film.photos_count} photos • Ready in under 1 hour</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                    In Progress
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Films */}
        {completedFilms.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-lg font-medium text-white">Completed Films</h2>
            <div className="space-y-4">
              {completedFilms.map((film) => (
                <div
                  key={film.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Film completed</p>
                      <p className="text-sm text-white/60">{film.photos_count} photos</p>
                    </div>
                  </div>
                  <button className="rounded-full bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders History */}
        <div className="mt-12">
          <h2 className="mb-6 text-lg font-medium text-white">Order History</h2>
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white/60">No orders yet</p>
              <Link
                href="/product/flashback"
                className="mt-4 inline-flex items-center text-[#E8C547] hover:underline"
              >
                Get your first film →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div>
                    <p className="font-medium text-white">
                      {order.plan === "pack" ? "3 Films Pack" : "1 Film"}
                    </p>
                    <p className="text-sm text-white/60">
                      {new Date(order.created_at).toLocaleDateString()} • {order.films_used}/{order.films_total} used
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs ${
                    order.status === "active" 
                      ? "bg-green-500/20 text-green-500" 
                      : "bg-white/10 text-white/60"
                  }`}>
                    {order.status === "active" ? "Active" : "Completed"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buy More */}
        {totalFilmsAvailable === 0 && (
          <div className="mt-12 text-center">
            <p className="text-white/60">Want to create more films?</p>
            <Link
              href="/product/flashback"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#E8C547] px-8 py-3 font-semibold text-black transition-colors hover:bg-[#d4b33d]"
            >
              Buy More Films
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

