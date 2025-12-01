import type { Metadata } from "next";
import { siteConfig } from "../siteConfig";

export const metadata: Metadata = {
  title: `Terms of Use - ${siteConfig.name} | Service Terms & Conditions`,
  description:
    "Read Movila's terms of use and service conditions. Understand your rights and obligations when using our mini-film generation service.",
  keywords: [
    "terms of use",
    "terms of service",
    "service agreement",
    "user terms",
    "Movila terms",
    "service conditions",
    "legal terms",
  ],
  openGraph: {
    title: `Terms of Use - ${siteConfig.name} | Service Terms & Conditions`,
    description:
      "Read Movila's terms of use and service conditions. Understand your rights and obligations when using our mini-film generation service.",
    url: `${siteConfig.url}/terms`,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/images/preview.png`,
        width: 1200,
        height: 630,
        alt: "Movila Terms of Use",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Terms of Use - ${siteConfig.name} | Service Terms & Conditions`,
    description:
      "Read Movila's terms of use and service conditions. Understand your rights and obligations when using our heritage film creation service.",
    images: [`${siteConfig.url}/images/preview.png`],
  },
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
};

export default function Terms() {
  return (
    <main className="min-h-screen bg-black">
      {/* Top gradient */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[5] h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl px-6 pt-32 pb-24">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-block rounded-full border border-[#E8C547]/30 bg-[#E8C547]/10 px-4 py-1.5 text-sm text-[#E8C547]">
            Terms of Use
          </span>
          <h1 className="mt-6 font-cormorant text-4xl font-light italic text-white sm:text-5xl">
            Service Terms & Conditions
          </h1>
          <p className="mt-4 text-white/60">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="text-white/80 leading-relaxed">
              Movila &ndash; Terms of Use
            </p>
          </div>

          {/* Section 1 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              1. Scope and Parties
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">1.1</strong> These Terms of Use
              (&ldquo;Terms&rdquo;) govern all use of the Movila platform and
              services (&ldquo;Service&rdquo;). By using our Service, you agree
              to these Terms.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">1.2</strong> Movila is operated by
              LFG Labs (&ldquo;Movila&rdquo;, &ldquo;Provider&rdquo;,
              &ldquo;we&rdquo; or &ldquo;us&rdquo;), a company under Swiss law.
              The Provider and the Customer (&ldquo;you&rdquo;) agree that only
              these Terms shall govern the contract.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">1.3</strong> Any deviating or
              supplemental terms will not become part of the contract unless we
              have expressly agreed to them in writing.
            </p>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              2. Services Provided by Movila
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">2.1 Core Service:</strong> We
              provide a platform that transforms family photos into cinematic
              heritage films. Using AI technology, we create moving tributes
              that honor the journey, emotions, and memories of your loved ones.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">2.2 Service Description:</strong>{" "}
              Our service includes:
            </p>
            <ul className="mt-2 space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                Photo upload and secure storage during processing
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                AI-powered film creation with transitions and color grading
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                Music selection from our curated library
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                HD video delivery via email
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                One round of revisions per order
              </li>
            </ul>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">2.3 Service Modifications:</strong>{" "}
              Movila may make reasonable changes to the Service (e.g., to
              improve quality or comply with laws) provided such changes do not
              eliminate core features. We will inform you of any material
              changes in a timely manner.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">2.4 Delivery Times:</strong> Most
              heritage films are ready within an hour. These are estimated
              delivery times and may vary based on order volume and complexity.
            </p>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              3. Customer Obligations
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">3.1</strong> You agree to use
              Movila&rsquo;s Service only for legitimate purposes and in
              compliance with all applicable laws. You represent that you have
              the right to use and share all photos you upload.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">3.2 Photo Rights:</strong> By
              uploading photos, you represent and warrant that:
            </p>
            <ul className="mt-2 space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                You own or have permission to use the photos
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                The photos do not violate any third-party rights
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                The photos do not contain illegal content
              </li>
            </ul>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">3.3 Prohibited Uses:</strong> You
              shall not use the Service to create content that is illegal,
              defamatory, or violates any third-party rights.
            </p>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              4. Intellectual Property and Data
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">4.1 Service IP:</strong> All
              intellectual property rights in the Movila Service (including the
              software, algorithms, and documentation) are and remain the
              exclusive property of Flashback AI.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">4.2 Your Photos:</strong> You
              retain all rights to the photos you upload. By uploading photos,
              you grant Movila a limited license to process them solely for
              creating your heritage film. We will not use your photos for any
              other purpose without your consent.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">4.3 Your Film:</strong> Upon
              delivery, you own the resulting heritage film and may use it for
              personal, non-commercial purposes including sharing with family
              and friends.
            </p>
          </div>

          {/* Section 5 - Fees and Payment with Refund Policy */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              5. Fees and Payment
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">5.1 Fees:</strong> Pricing for our
              services is displayed on our website at the time of order. All
              prices are inclusive of applicable taxes unless otherwise stated.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">5.2 Payment:</strong> Payment is
              due at the time of order via the payment methods available on our
              platform.
            </p>
            <div className="mt-6 rounded-xl border border-[#E8C547]/30 bg-[#E8C547]/10 p-4">
              <p className="text-white/90 leading-relaxed">
                <strong className="text-[#E8C547]">5.3 Refund Policy:</strong>{" "}
                Once your video has been generated, no refund is available due
                to the computational resources and AI processing already
                consumed. If you are not satisfied with your heritage film
                before video generation, please contact us. For generated films,
                we offer one round of revisions. Refunds may only be considered
                at our discretion for orders where video generation has not yet
                begun.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              6. Limitation of Liability
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">6.1</strong> Movila shall be liable
              without limit in cases of intentional misconduct or gross
              negligence.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">6.2</strong> In cases of ordinary
              negligence, Movila will only be liable for breach of essential
              contractual obligations.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">6.3</strong> In no event shall our
              liability exceed the amount paid for the specific order giving
              rise to the claim.
            </p>
          </div>

          {/* Section 7 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              7. Privacy and Data Protection
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">7.1</strong> Your privacy is
              important to us. Please review our Privacy Policy for information
              on how we collect, use, and protect your data.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">7.2</strong> Photos are encrypted
              during upload and storage, and deleted from our servers within 30
              days of delivering your film.
            </p>
          </div>

          {/* Section 8 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              8. Governing Law and Jurisdiction
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">8.1 Governing Law:</strong> This
              Agreement and any disputes arising out of it shall be governed by
              the laws of Switzerland, excluding its conflict-of-laws rules.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">8.2 Jurisdiction:</strong> The
              exclusive place of jurisdiction for all disputes arising from or
              in connection with these Terms shall be Zug, Switzerland.
            </p>
          </div>

          {/* Section 9 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              9. Final Provisions
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">9.1 Changes to Terms:</strong>{" "}
              Movila reserves the right to modify these Terms. We will notify
              users of material changes via email or notice on our website.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              <strong className="text-white">9.2 Severability:</strong> Should
              any provision of these Terms be or become invalid, the remainder
              shall remain in effect.
            </p>
            <div className="mt-6 rounded-xl bg-white/5 p-4 text-white/60">
              <p className="font-medium text-white">9.3 Contact:</p>
              <p className="mt-1">LFG Labs</p>
              <p>c/o Sielva Management SA</p>
              <p>Gubelstrasse 11</p>
              <p>6300 Zug, Switzerland</p>
              <p className="mt-2 text-[#E8C547]">contact@movila.io</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
