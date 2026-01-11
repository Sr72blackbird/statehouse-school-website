import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import { renderBlocks } from "@/lib/render-blocks";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await fetchFromStrapi<AdmissionsPageResponse>(
      "/admissions-page?populate=*"
    );
    const title = response.data.title;
    
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
  const response = await fetchFromStrapi<AdmissionsPageResponse>(
    "/admissions-page?populate=*"
  );

  const data = response.data;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--school-grey)" }}
    >
      <Header />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-center"
          style={{ color: "var(--school-navy)" }}
        >
          {data.title}
        </h1>

        {/* Introduction */}
        <div className="mb-12 prose prose-lg max-w-none">
          {renderBlocks(data.introduction)}
        </div>
      </section>

      {/* Admission Process */}
      {data.process && data.process.length > 0 && (
        <section
          className="py-16"
          style={{ backgroundColor: "var(--school-grey-strong)" }}
        >
          <div className="max-w-6xl mx-auto px-6">
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
        </section>
      )}

      {/* Contact Information */}
      {data.contact_info && data.contact_info.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
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
        </section>
      )}

      {/* Admission Requirements Section */}
      <section
        className="py-16"
        style={{ backgroundColor: "var(--school-grey-strong)" }}
      >
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
