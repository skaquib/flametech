import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQs — Industrial Burners, Spare Parts & AMC Service",
  description: "Answers to common questions about buying industrial gas & oil burners, ordering spare parts, GST invoicing, AMC service coverage, and repair support from FlameTech Engineering.",
  keywords: [
    "industrial burner FAQ",
    "burner AMC service questions",
    "buy burner spare parts online India",
    "industrial burner repair Mumbai",
    "FlameTech Engineering support",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQs | FlameTech Engineering",
    description: "Common questions about industrial burners, spare parts ordering, AMC service, and repair support.",
    url: "/faq",
    type: "website",
  },
};

const faqs = [
  {
    question: "How do I get a price quote for an industrial burner?",
    answer:
      "Industrial equipment (gas burners, oil burners, control panels) is quote-only since pricing depends on thermal power, fuel type, and site conditions. Tap \"Request Quote\" on any equipment page or WhatsApp us directly with your requirement — we'll respond with pricing and lead time.",
  },
  {
    question: "Can I buy spare parts directly without requesting a quote?",
    answer:
      "Yes. Spare parts (solenoid valves, ignition electrodes, flame sensors, and other accessories) are listed with fixed pricing and can be ordered directly — add to cart and checkout, which connects you to our team on WhatsApp to confirm the order and arrange payment and shipping.",
  },
  {
    question: "Do you ship spare parts across India, or only in Mumbai?",
    answer:
      "We ship pan-India. We're based in Mumbai (Mahim West) with in-stock spare parts ready to dispatch to any state.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We currently coordinate payment directly over WhatsApp/phone after confirming your order — bank transfer, UPI, and other B2B payment methods are supported. A GST invoice is issued for every order.",
  },
  {
    question: "Do you provide GST invoices for B2B purchases?",
    answer:
      "Yes, every order — equipment or spare parts — is billed with a proper GST invoice for your company's records and input tax credit.",
  },
  {
    question: "What's included in FlameTech's AMC (Annual Maintenance Contract)?",
    answer:
      "Our AMC program covers bi-monthly (every 2 months) scheduled inspection visits plus priority emergency breakdown support, starting at ₹799 + GST per visit. See the AMC Service page for full details and to enroll.",
  },
  {
    question: "My burner isn't igniting — is that covered under AMC, or is it a separate repair?",
    answer:
      "If you already have an active AMC contract, breakdown visits like this are covered under your plan's priority support. Without an AMC, we still provide one-off repair visits — WhatsApp us with the burner model and symptom (no ignition, weak flame, tripping, etc.) and we'll advise next steps.",
  },
  {
    question: "How do I know which burner model (FT-03 to FT-25) fits my equipment?",
    answer:
      "The FT-series is sized by thermal power output — FT-03 and FT-05 suit smaller bakery ovens, FT-10 and FT-15 suit larger dryers and mid-size boilers, and FT-20/FT-25 are built for heavy industrial furnaces and boilers. Share your existing burner's rating or oven/boiler specification over WhatsApp and we'll recommend the right model.",
  },
  {
    question: "Which industries do you serve?",
    answer:
      "Bakeries, powder coating plants, chemical processing, pharmaceutical manufacturing, ceramics, and textile industries are among our most common customers, alongside general industrial boiler and furnace operators.",
  },
  {
    question: "Do you build custom control panels for existing burner setups?",
    answer:
      "Yes. Beyond our standard semi-automatic and automatic control panels, we build custom panels to match specific burner models, safety interlocks, or plant automation requirements — share your setup details over WhatsApp.",
  },
  {
    question: "Are your burners ISO or CE certified?",
    answer:
      "Yes — FlameTech Engineering is ISO 9001:2008 certified and our burners carry CE certification, supporting both domestic compliance and export requirements.",
  },
  {
    question: "How quickly can spare parts be delivered?",
    answer:
      "Most listed spare parts are in stock and ship within 1-2 business days pan-India; exact transit time depends on your location. We'll confirm dispatch and expected delivery when you place an order over WhatsApp.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "FAQs", item: `${SITE_URL}/faq` },
  ],
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <FaqClient faqs={faqs} />
    </>
  );
}
