import { Badge } from "../components/Badge";
import type { Metadata } from "next";
import Balancer from "react-wrap-balancer";
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
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section
        aria-labelledby="privacy-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>Privacy Policy</Badge>
        <h1
          id="privacy-overview"
          className="mt-2 inline-block bg-gradient-to-br from-text to-text-secondary bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        >
          <Balancer>Data Protection & Privacy Policy</Balancer>
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
          <p>
            We, LFG Labs (&ldquo;Movila/we&rdquo;), welcome your use of our
            website and web app (&ldquo;Our Services&rdquo;). In the following
            provisions, we inform you about the type, scope, and purposes of the
            collection and use of your personal data when using our services.
            Personal data refers to any information that relates to an
            identified or identifiable natural person. This includes, in
            particular, your name, email address, and any photos you upload.
          </p>
          <p>
            In addition to the General Data Protection Regulation (GDPR), we
            also comply with the Swiss Federal Act on Data Protection (nFADP),
            as applicable.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            1. Provider
          </h3>
          <p>
            The provider and responsible party for data processing
            (&ldquo;controller&rdquo; under the GDPR and &ldquo;responsible
            party&rdquo; under the Swiss nFADP) is:
          </p>
          <div className="p-4">
            <p className="mb-2">
              <strong>LFG Labs</strong>
            </p>
            <p>c/o Sielva Management SA</p>
            <p>Gubelstrasse 11</p>
            <p>6300 Zug, Switzerland</p>
            <p>CHE-392.547.093 MWST</p>
            <p>Email: contact@lfglabs.dev</p>
          </div>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            2. Data Processing to Enable Use
          </h3>
          <p>
            Whenever you access the content of our services, connection data is
            transmitted to our web server. This connection data includes:
          </p>
          <ul>
            <li>The IP address of the user,</li>
            <li>The date and time of the request,</li>
            <li>The referring URL,</li>
            <li>
              Device numbers such as UDID (Unique Device Identifier) and
              comparable device numbers, device information (e.g., device type),
            </li>
            <li>Browser type / browser version.</li>
          </ul>
          <p>
            This connection data is not used to infer the identity of the user
            or merged with data from other sources, but rather serves to provide
            the website. The legal basis for processing your data is Art. 6
            para. 1 sentence 1 lit. f GDPR.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            3. Photo Data Processing
          </h3>
          <p>
            When you use our heritage film creation service, we process your
            uploaded photos as follows:
          </p>

          <h3 className="mb-4 mt-8 text-lg font-semibold text-text-secondary-dark dark:text-gray-50">
            3.1. Photo Upload and Storage
          </h3>
          <p>
            Photos you upload are:
          </p>
          <ul>
            <li>
              <strong>Encrypted</strong> during upload and storage using
              industry-standard encryption.
            </li>
            <li>
              <strong>Processed</strong> only for the purpose of creating your
              heritage film.
            </li>
            <li>
              <strong>Deleted</strong> from our servers within 30 days of
              delivering your completed film.
            </li>
          </ul>
          <p>
            <strong>Purpose:</strong> Creating your personalized heritage film.
            <br />
            <strong>Legal basis:</strong> Art. 6 para. 1 sentence 1 lit. b GDPR
            (contract fulfillment).
          </p>

          <h3 className="mb-4 mt-8 text-lg font-semibold text-text-secondary-dark dark:text-gray-50">
            3.2. Contact and Orders
          </h3>
          <p>
            For placing orders and contacting us, we collect the following
            personal data:
          </p>
          <ul>
            <li>
              <strong>Email address:</strong> for communication and delivery.
            </li>
            <li>
              <strong>Name:</strong> for personalized communication.
            </li>
            <li>
              <strong>Payment information:</strong> processed securely through
              our payment providers.
            </li>
          </ul>
          <p>
            <strong>Purpose:</strong> Enabling communication and providing our
            services.
            <br />
            <strong>Legal basis:</strong> Art. 6 para. 1 sentence 1 lit. b GDPR
            (contract fulfillment) and Art. 6 para. 1 sentence 1 lit. f GDPR
            (legitimate interest in providing the service).
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            4. Data Processing for Service Optimization
          </h3>
          <p>
            Our services use cookies to ensure functionality and analyze user
            behavior. Some cookies are necessary for website functionality
            (e.g., session cookies), while others are used for analysis. You can
            manage or disable cookies via your browser settings, but this may
            limit the website&rsquo;s functionality.
          </p>
          <p>
            The storage of necessary and functional cookies is based on Art. 6
            para. 1 lit. f GDPR, while all others are based on your consent
            under Art. 6 para. 1 lit. a GDPR. Where applicable, consent for
            cookies is obtained in accordance with both the GDPR and the Swiss
            nFADP. You can adjust your cookie preferences at any time via the
            cookie banner and may revoke this consent at any time.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            5. Data Transfer
          </h3>
          <p>
            We only transfer your data when it is necessary for the provision of
            our services, you have consented, a legal obligation exists, or
            another legal basis applies. Your photos are never shared with third
            parties except as strictly necessary to process your order.
          </p>

          <h3 className="mb-4 mt-8 text-lg font-semibold text-text-secondary-dark dark:text-gray-50">
            5.1. Data Transfer to Non-EU Countries
          </h3>
          <p>
            Your data may also be transferred to recipients outside Switzerland
            or the EU. Where no adequacy decision exists, we rely primarily on
            Standard Contractual Clauses (SCCs). In limited cases, data may be
            transferred based on your explicit consent or other derogations
            under Art. 49 GDPR.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            6. Storage Duration
          </h3>
          <p>
            We store your data only as long as necessary to fulfill the purposes
            for which it was processed:
          </p>
          <ul>
            <li>
              <strong>Photos:</strong> Deleted within 30 days of film delivery.
            </li>
            <li>
              <strong>Account data:</strong> Retained until account deletion or
              legal retention periods expire.
            </li>
            <li>
              <strong>Order records:</strong> Retained as required by applicable
              tax and commercial laws.
            </li>
          </ul>

          <h3 className="mb-4 mt-8 text-lg font-semibold text-text-secondary-dark dark:text-gray-50">
            6.1. Security Measures
          </h3>
          <p>
            We protect your data with technical and organizational measures
            against unauthorized access and loss, including encryption of photos
            during upload and storage.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            7. Your Rights
          </h3>
          <p>
            You have the right to access, correct, delete, restrict processing,
            and object to the processing of your personal data. You also have
            the right to data portability and to lodge a complaint with a
            supervisory authority. Further information can be found under
            applicable legal provisions.
          </p>
          <p>
            If you believe your data has been unlawfully processed, you have the
            right to lodge a complaint with the Swiss Federal Data Protection
            and Information Commissioner (FDPIC) or a relevant EU supervisory
            authority if you reside in the EU.
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            8. Right to Object
          </h3>
          <p>
            You can object to the processing of your data at any time,
            particularly for processing based on legitimate interests (Art. 6
            para. 1 lit. f GDPR).
          </p>

          <h3 className="mb-6 mt-12 text-xl font-bold text-text-secondary-dark dark:text-gray-50">
            9. Changes to the Privacy Policy
          </h3>
          <p>
            We will update this privacy policy as necessary. The current version
            is always available on our website. We will notify you of
            significant changes.
          </p>
        </div>
      </section>
    </div>
  );
}
