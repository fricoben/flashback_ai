import Link from "next/link";
import { siteConfig } from "./siteConfig";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          src="/home_video.mp4"
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Top fade gradient - like Artlist */}
      <div 
        className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-56"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom fade gradient */}
      <div 
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-64"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Hero Content */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1
          className="max-w-5xl animate-slide-up-fade font-cormorant text-5xl font-light italic leading-tight tracking-wide text-white sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ animationDuration: "800ms" }}
        >
          Turn life memories into mini-films
        </h1>

        <p
          className="mt-8 max-w-2xl animate-slide-up-fade text-lg font-light leading-relaxed text-white/90 sm:text-xl"
          style={{ animationDuration: "1000ms" }}
        >
          Movila generates beautiful mini-films from your life memories. 
          Upload your photos and watch as we transform them into cinematic stories.
        </p>

        <div
          className="mt-10 animate-slide-up-fade"
          style={{ animationDuration: "1200ms" }}
        >
          <Link
            href={siteConfig.mainCta}
            className="inline-flex h-14 items-center justify-center rounded-full bg-[#E8C547] px-10 text-lg font-semibold text-black transition-all duration-300 hover:bg-[#d4b33d] hover:shadow-lg hover:shadow-[#E8C547]/25"
          >
            Create Your Film
          </Link>
        </div>
      </section>
    </main>
  );
}
