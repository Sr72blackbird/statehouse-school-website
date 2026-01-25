import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import { renderBlocks } from "@/lib/render-blocks";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetchFromStrapi<AdmissionsPageResponse>(
      "/admissions-page?populate=*"
    );
    const title = response.data?.title || "Admissions";
    
    return {
      title: "Admissions",
      description: `${title} - Learn about our admission process and requirements.`,
      openGraph: {
        title: `Admissions - ${title}`,
        description: "Learn about our admission process and requirements.",
      },
    };
  } catch {
    return {
      title: "Admissions",
      description: "Learn about our admission process and requirements.",
    };
  }
}

type Block = {
  type: string;
  children?: Array<{ type: string; text?: string; bold?: boolean; italic?: boolean; underline?: boolean }>;
  level?: number;
  format?: string;
};

type AdmissionsPage = {
  title: string;
  introduction: Block[];
  process: Block[] | null;
  contact_info: Block[] | null;
};

type AdmissionsPageResponse = {
  data: AdmissionsPage;
};

export default async function AdmissionsPage() {
  let data: AdmissionsPage = {
    title: "Admissions",
    introduction: [],
    process: null,
    contact_info: null,
  };

  try {
    const response = await fetchFromStrapi<AdmissionsPageResponse>(
      "/admissions-page?populate=*"
    );
    if (response.data) {
      data = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch admissions page data:", error);
    // Continue with default data
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--school-grey)" }}>
      {/* Hero Section with Header */}
      <section className="relative">
        <Header />
        <PageHero 
          title={data.title}
          subtitle="Join our school community"
        />
      </section>

      {/* Gradient Wrapper for Content Sections */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(110, 193, 228, 0.25) 15%, rgba(110, 193, 228, 0.35) 35%, rgba(10, 31, 68, 0.15) 60%, rgba(10, 31, 68, 0.08) 80%, rgba(255, 255, 255, 1) 100%)"
        }}
      >
      {/* Introduction */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <div className="prose prose-lg max-w-none">
              {renderBlocks(data.introduction)}
            </div>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      {data.process && data.process.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <h2
                className="text-3xl font-bold mb-8"
                style={{ color: "var(--school-navy)" }}
              >
                Admission Process
              </h2>
              <div className="prose prose-lg max-w-none">
                {renderBlocks(data.process)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Information */}
      {data.contact_info && data.contact_info.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
              <h2
                className="text-3xl font-bold mb-8"
                style={{ color: "var(--school-navy)" }}
              >
                Contact Information
              </h2>
              <div className="prose prose-lg max-w-none">
                {renderBlocks(data.contact_info)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Admission Requirements Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="text-3xl font-bold mb-8"
            style={{ color: "var(--school-navy)" }}
          >
            Admission Requirements
          </h2>
          <AdmissionRequirementsList />
        </div>
      </section>
      </div>

      <Footer />
    </main>
  );
}

async function AdmissionRequirementsList() {
  type Requirement = {
    id: number;
    documentId?: string;
    title: string;
    description: Block[] | null;
    order: number | null;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  };

  type RequirementsResponse = {
    data: Requirement[];
  };

  try {
    const response = await fetchFromStrapi<RequirementsResponse>(
      "/admission-requirements?populate=*&sort=order:asc"
    );

    if (!response.data || response.data.length === 0) {
      return <p className="text-slate-700">No requirements listed at this time.</p>;
    }

    // Filter out any items without required fields
    const validRequirements = response.data.filter((req) => {
      return req && req.title;
    });

    if (validRequirements.length === 0) {
      return <p className="text-slate-700">No valid requirements found.</p>;
    }

    return (
      <div className="space-y-6">
        {validRequirements.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-lg shadow">
            <h3
              className="text-xl font-bold mb-3"
              style={{ color: "var(--school-navy)" }}
            >
              {req.title}
            </h3>
            {req.description && (
              <div className="prose max-w-none">
                {renderBlocks(req.description)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error loading admission requirements:", error);
    return (
      <div className="text-slate-700">
        <p>Unable to load requirements.</p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-sm text-red-600 mt-2">
            Error: {error instanceof Error ? error.message : String(error)}
          </p>
        )}
      </div>
    );
  }
}
