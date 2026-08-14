"use client";

import { Puck, Data } from "@puckeditor/core";
import { createAiPlugin } from "@puckeditor/plugin-ai";
import { config } from "@/puck.config";

export function PuckEditor({ initialData }: { initialData?: Data }) {
  const aiPlugin = createAiPlugin();

  const defaultData: Data = initialData && initialData.content?.length ? initialData : {
    content: [
      {
        type: "Hero",
        props: {
          id: "hero-1",
          badgeText: "Serving Maple Ridge & the Lower Mainland",
          title: "Beautiful Outdoor Spaces. Expertly Maintained.",
          description:
            "Professional landscaping, lawn care, garden maintenance, and outdoor improvements throughout Maple Ridge and the Lower Mainland.",
          bgImage:
            "https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1920",
          ctaText: "Get a Free Quote",
          ctaHref: "/quote",
          phoneText: "778-233-1599",
        },
      },
      {
        type: "WhyChooseUs",
        props: {
          id: "why-1",
          badgeText: "Why Najm",
          title: "The Najm Garden difference",
          description:
            "We take pride in delivering dependable, high-quality landscaping services across Maple Ridge and the Lower Mainland.",
        },
      },
      {
        type: "ServicesGrid",
        props: {
          id: "services-1",
          badgeText: "Our Services",
          title: "Everything your garden needs",
          limit: 8,
        },
      },
      {
        type: "GalleryGrid",
        props: {
          id: "gallery-1",
          badgeText: "Featured Work",
          title: "See the transformation",
          description:
            "A selection of our landscaping and garden maintenance projects.",
          limit: 6,
        },
      },
      {
        type: "ServiceAreas",
        props: {
          id: "areas-1",
          badgeText: "Service Area",
          title: "Serving Maple Ridge & surrounding communities",
          description:
            "Based in Maple Ridge, BC, we proudly serve homeowners and properties throughout the Lower Mainland.",
        },
      },
      {
        type: "CallToAction",
        props: {
          id: "cta-1",
          title: "Ready to improve your outdoor space?",
          description:
            "Request a free quote and let's discuss how we can bring your outdoor space to life.",
          ctaText: "Request a Free Quote",
          ctaHref: "/quote",
          phoneText: "778-233-1599",
        },
      },
    ],
    root: { props: { title: "Home Page" } },
  };

  return (
    <div className="h-screen w-full">
      <Puck
        config={config}
        data={defaultData}
        plugins={[aiPlugin]}
        onPublish={async (data) => {
          try {
            const res = await fetch("/api/puck/save", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            if (res.ok) {
              alert("Page published and saved successfully!");
            }
          } catch (e) {
            console.error("Failed to publish", e);
          }
        }}
      />
    </div>
  );
}
