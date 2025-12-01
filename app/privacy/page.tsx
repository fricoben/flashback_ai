import type { Metadata } from "next";
import { siteConfig } from "../siteConfig";

export const metadata: Metadata = {
  title: `Privacy Policy - ${siteConfig.name} | Data Protection & Privacy`,
  description:
    "Learn how Movila protects your data and privacy. Our comprehensive privacy policy explains data collection, usage, and your rights regarding your family photos and personal information.",
  keywords: [
    "privacy policy",
    "data protection",
    "GDPR",
    "privacy rights",
    "Movila privacy",
    "photo privacy",
    "data security",
    "user privacy",
    "data processing",
  ],
  openGraph: {
    title: `Privacy Policy - ${siteConfig.name} | Data Protection & Privacy`,
    description:
      "Learn how Movila protects your data and privacy. Our comprehensive privacy policy explains data collection, usage, and your rights.",
    url: `${siteConfig.url}/privacy`,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/images/preview.png`,
        width: 1200,
        height: 630,
        alt: "Movila Privacy Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy - ${siteConfig.name} | Data Protection & Privacy`,
    description:
      "Learn how Movila protects your data and privacy. Our comprehensive privacy policy explains data collection, usage, and your rights.",
    images: [`${siteConfig.url}/images/preview.png`],
  },
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
};

export default function Privacy() {
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
            Privacy Policy
          </span>
          <h1 className="mt-6 font-cormorant text-4xl font-light italic text-white sm:text-5xl">
            Data Protection & Privacy Policy
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
              We, LFG Labs (&ldquo;Movila/we&rdquo;), welcome your use of our
              website and web app (&ldquo;Our Services&rdquo;). In the following
              provisions, we inform you about the type, scope, and purposes of
              the collection and use of your personal data when using our
              services. Personal data refers to any information that relates to
              an identified or identifiable natural person. This includes, in
              particular, your name, email address, and any photos you upload.
            </p>
            <p className="mt-4 text-white/80 leading-relaxed">
              In addition to the General Data Protection Regulation (GDPR), we
              also comply with the Swiss Federal Act on Data Protection (nFADP),
              as applicable.
            </p>
          </div>

          {/* Section 1 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">1. Provider</h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              The provider and responsible party for data processing
              (&ldquo;controller&rdquo; under the GDPR and &ldquo;responsible
              party&rdquo; under the Swiss nFADP) is:
            </p>
            <div className="mt-4 rounded-xl bg-white/5 p-4 text-white/60">
              <p className="font-medium text-white">LFG Labs</p>
              <p className="mt-1">c/o Sielva Management SA</p>
              <p>Gubelstrasse 11</p>
              <p>6300 Zug, Switzerland</p>
              <p>CHE-392.547.093 MWST</p>
              <p className="mt-2 text-[#E8C547]">contact@lfglabs.dev</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              2. Data Processing to Enable Use
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Whenever you access the content of our services, connection data
              is transmitted to our web server. This connection data includes:
            </p>
            <ul className="mt-4 space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                The IP address of the user
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                The date and time of the request
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                The referring URL
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                Device numbers such as UDID and comparable device numbers,
                device information (e.g., device type)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                Browser type / browser version
              </li>
            </ul>
            <p className="mt-4 text-white/60 text-sm">
              This connection data is not used to infer the identity of the user
              or merged with data from other sources. Legal basis: Art. 6 para.
              1 sentence 1 lit. f GDPR.
            </p>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              3. Photo Data Processing
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              When you use our heritage film creation service, we process your
              uploaded photos as follows:
            </p>

            <h3 className="mt-6 font-medium text-white">
              3.1. Photo Upload and Storage
            </h3>
            <p className="mt-2 text-white/80">Photos you upload are:</p>
            <ul className="mt-2 space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                <span>
                  <strong className="text-white">Encrypted</strong> during
                  upload and storage using industry-standard encryption.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                <span>
                  <strong className="text-white">Processed</strong> only for the
                  purpose of creating your heritage film.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                <span>
                  <strong className="text-white">Deleted</strong> from our
                  servers within 30 days of delivering your completed film.
                </span>
              </li>
            </ul>
            <p className="mt-4 text-white/60 text-sm">
              <strong className="text-white/80">Purpose:</strong> Creating your
              personalized heritage film.
              <br />
              <strong className="text-white/80">Legal basis:</strong> Art. 6
              para. 1 sentence 1 lit. b GDPR (contract fulfillment).
            </p>

            <h3 className="mt-6 font-medium text-white">
              3.2. Contact and Orders
            </h3>
            <p className="mt-2 text-white/80">
              For placing orders and contacting us, we collect:
            </p>
            <ul className="mt-2 space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                <span>
                  <strong className="text-white">Email address:</strong> for
                  communication and delivery.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                <span>
                  <strong className="text-white">Name:</strong> for personalized
                  communication.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                <span>
                  <strong className="text-white">Payment information:</strong>{" "}
                  processed securely through our payment providers.
                </span>
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              4. Data Processing for Service Optimization
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Our services use cookies to ensure functionality and analyze user
              behavior. Some cookies are necessary for website functionality
              (e.g., session cookies), while others are used for analysis. You
              can manage or disable cookies via your browser settings, but this
              may limit the website&rsquo;s functionality.
            </p>
            <p className="mt-4 text-white/60 text-sm">
              The storage of necessary and functional cookies is based on Art. 6
              para. 1 lit. f GDPR, while all others are based on your consent
              under Art. 6 para. 1 lit. a GDPR.
            </p>
          </div>

          {/* Section 5 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              5. Data Transfer
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              We only transfer your data when it is necessary for the provision
              of our services, you have consented, a legal obligation exists, or
              another legal basis applies. Your photos are never shared with
              third parties except as strictly necessary to process your order.
            </p>

            <h3 className="mt-6 font-medium text-white">
              5.1. Data Transfer to Non-EU Countries
            </h3>
            <p className="mt-2 text-white/80">
              Your data may also be transferred to recipients outside
              Switzerland or the EU. Where no adequacy decision exists, we rely
              primarily on Standard Contractual Clauses (SCCs). In limited
              cases, data may be transferred based on your explicit consent or
              other derogations under Art. 49 GDPR.
            </p>
          </div>

          {/* Section 6 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              6. Storage Duration
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              We store your data only as long as necessary to fulfill the
              purposes for which it was processed:
            </p>
            <ul className="mt-4 space-y-2 text-white/80">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                <span>
                  <strong className="text-white">Photos:</strong> Deleted within
                  30 days of film delivery.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                <span>
                  <strong className="text-white">Account data:</strong> Retained
                  until account deletion or legal retention periods expire.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#E8C547]" />
                <span>
                  <strong className="text-white">Order records:</strong>{" "}
                  Retained as required by applicable tax and commercial laws.
                </span>
              </li>
            </ul>

            <h3 className="mt-6 font-medium text-white">
              6.1. Security Measures
            </h3>
            <p className="mt-2 text-white/80">
              We protect your data with technical and organizational measures
              against unauthorized access and loss, including encryption of
              photos during upload and storage.
            </p>
          </div>

          {/* Section 7 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              7. Your Rights
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              You have the right to access, correct, delete, restrict
              processing, and object to the processing of your personal data.
              You also have the right to data portability and to lodge a
              complaint with a supervisory authority.
            </p>
            <p className="mt-4 text-white/60 text-sm">
              If you believe your data has been unlawfully processed, you have
              the right to lodge a complaint with the Swiss Federal Data
              Protection and Information Commissioner (FDPIC) or a relevant EU
              supervisory authority if you reside in the EU.
            </p>
          </div>

          {/* Section 8 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              8. Right to Object
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              You can object to the processing of your data at any time,
              particularly for processing based on legitimate interests (Art. 6
              para. 1 lit. f GDPR).
            </p>
          </div>

          {/* Section 9 */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-[#E8C547]">
              9. Changes to the Privacy Policy
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              We will update this privacy policy as necessary. The current
              version is always available on our website. We will notify you of
              significant changes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
