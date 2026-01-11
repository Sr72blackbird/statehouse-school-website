import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFromStrapi } from "@/lib/strapi";
import { renderBlocks } from "@/lib/render-blocks";

export const metadata: Metadata = {
  title: "Academics",
  description: "Explore our academic programs, CBC pathways, and learning areas. Discover our comprehensive curriculum designed for excellence.",
  openGraph: {
    title: "Academics - Statehouse School",
    description: "Explore our academic programs, CBC pathways, and learning areas.",
  },
};

type Block = {
  type: string;
  children?: Array<{ type: string; text?: string; bold?: boolean; italic?: boolean; underline?: boolean }>;
  level?: number;
  format?: string;
};

type CBCPathway = {
  id: number;
  attributes: {
    name: string;
    description: Block[] | null;
    order: number | null;
  };
};

type LearningAreaSubject = {
  id: number;
  attributes: {
    name: string;
    description: Block[] | null;
    department: { data: { attributes: { name: string } } | null } | null;
    pathway: { data: { attributes: { name: string } } | null } | null;
    order: number | null;
  };
};

type PathwaysResponse = {
  data: CBCPathway[];
};

type SubjectsResponse = {
  data: LearningAreaSubject[];
};

export default async function AcademicsPage() {
  let pathways: CBCPathway[] = [];
  let subjects: LearningAreaSubject[] = [];

  let errorMessage: string | null = null;

  try {
    const [pathwaysResponse, subjectsResponse] = await Promise.all([
      fetchFromStrapi<PathwaysResponse>(
        "/cbc-pathways?populate=*&sort=order:asc"
      ),
      fetchFromStrapi<SubjectsResponse>(
        "/learning-areas-subjects?populate=*&sort=order:asc"
      ),
    ]);

    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("Pathways response:", JSON.stringify(pathwaysResponse, null, 2));
      console.log("Subjects response:", JSON.stringify(subjectsResponse, null, 2));
    }

    pathways = pathwaysResponse.data || [];
    subjects = subjectsResponse.data || [];

    // Check if data structure is flat (like admission requirements)
    if (pathways.length > 0 && !pathways[0].attributes) {
      // Data is flat, need to transform it
      pathways = pathways.map((p: any) => ({
        id: p.id,
        attributes: {
          name: p.name,
          description: p.description,
          order: p.order,
        },
      })) as CBCPathway[];
    }

    if (subjects.length > 0 && !subjects[0].attributes) {
      // Data is flat, need to transform it
      subjects = subjects.map((s: any) => ({
        id: s.id,
        attributes: {
          name: s.name,
          description: s.description,
          department: s.department,
          pathway: s.pathway,
          order: s.order,
        },
      })) as LearningAreaSubject[];
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Processed pathways:", pathways);
      console.log("Processed subjects:", subjects);
    }
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error loading academics data:", error);
    if (process.env.NODE_ENV === "development") {
      console.error("Full error:", error);
    }
    // Continue rendering with empty arrays
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--school-grey)" }}
    >
      <Header />

          <section className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 text-center"
              style={{ color: "var(--school-navy)" }}
            >
              Academics
            </h1>

        {/* CBC Pathways Section */}
        {pathways.length > 0 && (
          <div className="mb-16">
            <h2
              className="text-3xl font-bold mb-8"
              style={{ color: "var(--school-navy)" }}
            >
              CBC Pathways
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pathways.map((pathway) => (
                <div
                  key={pathway.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: "var(--school-navy)" }}
                  >
                    {pathway.attributes.name}
                  </h3>
                  {pathway.attributes.description && (
                    <div className="prose max-w-none">
                      {renderBlocks(pathway.attributes.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Areas/Subjects Section */}
        {subjects.length > 0 && (
          <div>
            <h2
              className="text-3xl font-bold mb-8"
              style={{ color: "var(--school-navy)" }}
            >
              Learning Areas & Subjects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: "var(--school-navy)" }}
                  >
                    {subject.attributes.name}
                  </h3>
                  {subject.attributes.department?.data && (
                    <p className="text-sm text-slate-600 mb-2">
                      Department: {subject.attributes.department.data.attributes.name}
                    </p>
                  )}
                  {subject.attributes.pathway?.data && (
                    <p className="text-sm text-slate-600 mb-3">
                      Pathway: {subject.attributes.pathway.data.attributes.name}
                    </p>
                  )}
                  {subject.attributes.description && (
                    <div className="prose prose-sm max-w-none">
                      {renderBlocks(subject.attributes.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {pathways.length === 0 && subjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-700 text-lg">No academic information available.</p>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 text-sm">
                <p className="text-slate-500">Check the browser console for API response details.</p>
                {errorMessage && (
                  <p className="text-red-600 mt-2">Error: {errorMessage}</p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
