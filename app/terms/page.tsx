import { Badge } from "../components/Badge";
import type { Metadata } from "next";
import Balancer from "react-wrap-balancer";
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
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section
        aria-labelledby="terms-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Terms of Use</Badge>
        <h1
          id="terms-overview"
          className="mt-2 inline-block bg-gradient-to-br from-text to-text-secondary bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        >
          <Balancer>Service Terms & Conditions</Balancer>
        </h1>
        <p className="text-secondary-dark dark:text-secondary-light mt-6 max-w-2xl text-lg">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-4xl">
        <div className="prose prose-gray max-w-none dark:prose-invert">
          <p>Movila &ndash; Terms of Use</p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            1. Scope and Parties
          </h3>

          <p>
            <strong>1.1</strong> These Terms of Use (&ldquo;Terms&rdquo;) govern
            all use of the Movila platform and services
            (&ldquo;Service&rdquo;). By using our Service, you agree to these
            Terms.
          </p>

          <p>
            <strong>1.2</strong> Movila is operated by LFG Labs
            (&ldquo;Movila&rdquo;, &ldquo;Provider&rdquo;, &ldquo;we&rdquo;
            or &ldquo;us&rdquo;), a company under Swiss law. The Provider and
            the Customer (&ldquo;you&rdquo;) agree that only these Terms shall
            govern the contract.
          </p>

          <p>
            <strong>1.3</strong> Any deviating or supplemental terms will not
            become part of the contract unless we have expressly agreed to them
            in writing.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            2. Services Provided by Movila
          </h3>

          <p>
            <strong>2.1 Core Service:</strong> We provide a platform that
            transforms family photos into cinematic heritage films. Using AI
            technology, we create moving tributes that honor the journey,
            emotions, and memories of your loved ones.
          </p>

          <p>
            <strong>2.2 Service Description:</strong> Our service includes:
          </p>
          <ul>
            <li>Photo upload and secure storage during processing</li>
            <li>AI-powered film creation with transitions and color grading</li>
            <li>Music selection from our curated library</li>
            <li>HD video delivery via email</li>
            <li>One round of revisions per order</li>
          </ul>

          <p>
            <strong>2.3 Service Modifications:</strong> Movila may make
            reasonable changes to the Service (e.g., to improve quality or
            comply with laws) provided such changes do not eliminate core
            features. We will inform you of any material changes in a timely
            manner.
          </p>

          <p>
            <strong>2.4 Delivery Times:</strong> Most heritage films are ready
            within 24-48 hours. These are estimated delivery times and may vary
            based on order volume and complexity.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            3. Customer Obligations
          </h3>

          <p>
            <strong>3.1</strong> You agree to use Movila&rsquo;s Service
            only for legitimate purposes and in compliance with all applicable
            laws. You represent that you have the right to use and share all
            photos you upload.
          </p>

          <p>
            <strong>3.2 Photo Rights:</strong> By uploading photos, you
            represent and warrant that:
          </p>
          <ul>
            <li>You own or have permission to use the photos</li>
            <li>The photos do not violate any third-party rights</li>
            <li>The photos do not contain illegal content</li>
          </ul>

          <p>
            <strong>3.3 Prohibited Uses:</strong> You shall not use the Service
            to create content that is illegal, defamatory, or violates any
            third-party rights.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            4. Intellectual Property and Data
          </h3>

          <p>
            <strong>4.1 Service IP:</strong> All intellectual property rights in
            the Movila Service (including the software, algorithms, and
            documentation) are and remain the exclusive property of Flashback
            AI.
          </p>

          <p>
            <strong>4.2 Your Photos:</strong> You retain all rights to the
            photos you upload. By uploading photos, you grant Movila a
            limited license to process them solely for creating your heritage
            film. We will not use your photos for any other purpose without your
            consent.
          </p>

          <p>
            <strong>4.3 Your Film:</strong> Upon delivery, you own the resulting
            heritage film and may use it for personal, non-commercial purposes
            including sharing with family and friends.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            5. Fees and Payment
          </h3>

          <p>
            <strong>5.1 Fees:</strong> Pricing for our services is displayed on
            our website at the time of order. All prices are inclusive of
            applicable taxes unless otherwise stated.
          </p>

          <p>
            <strong>5.2 Payment:</strong> Payment is due at the time of order
            via the payment methods available on our platform.
          </p>

          <p>
            <strong>5.3 Refunds:</strong> If you are not satisfied with your
            heritage film, please contact us within 14 days of delivery. We
            offer one round of revisions. Refunds may be provided at our
            discretion for orders that cannot be satisfactorily revised.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            6. Limitation of Liability
          </h3>

          <p>
            <strong>6.1</strong> Movila shall be liable without limit in
            cases of intentional misconduct or gross negligence.
          </p>

          <p>
            <strong>6.2</strong> In cases of ordinary negligence, Movila
            will only be liable for breach of essential contractual obligations.
          </p>

          <p>
            <strong>6.3</strong> In no event shall our liability exceed the
            amount paid for the specific order giving rise to the claim.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            7. Privacy and Data Protection
          </h3>

          <p>
            <strong>7.1</strong> Your privacy is important to us. Please review
            our Privacy Policy for information on how we collect, use, and
            protect your data.
          </p>

          <p>
            <strong>7.2</strong> Photos are encrypted during upload and storage,
            and deleted from our servers within 30 days of delivering your film.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            8. Governing Law and Jurisdiction
          </h3>

          <p>
            <strong>8.1 Governing Law:</strong> This Agreement and any disputes
            arising out of it shall be governed by the laws of Switzerland,
            excluding its conflict-of-laws rules.
          </p>

          <p>
            <strong>8.2 Jurisdiction:</strong> The exclusive place of
            jurisdiction for all disputes arising from or in connection with
            these Terms shall be Zug, Switzerland.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            9. Final Provisions
          </h3>

          <p>
            <strong>9.1 Changes to Terms:</strong> Movila reserves the
            right to modify these Terms. We will notify users of material
            changes via email or notice on our website.
          </p>

          <p>
            <strong>9.2 Severability:</strong> Should any provision of these
            Terms be or become invalid, the remainder shall remain in effect.
          </p>

          <p>
            <strong>9.3 Contact:</strong> LFG Labs, c/o Sielva Management SA,
            Gubelstrasse 11, 6300 Zug, Switzerland. Email: contact@movila.io
          </p>
        </div>
      </section>
    </div>
  );
}

