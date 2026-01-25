import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import { renderBlocks } from "@/lib/render-blocks";

export const metadata: Metadata = {
  title: "Departments",
  description: "Explore our academic departments and meet our department heads. Learn about our comprehensive academic structure.",
  openGraph: {
    title: "Academic Departments - Statehouse School",
    description: "Explore our academic departments and meet our department heads.",
  },
};

type Block = {
  type: string;
  children?: Array<{ type: string; text?: string; bold?: boolean; italic?: boolean; underline?: boolean }>;
  level?: number;
  format?: string;
};

type Media = {
  url: string;
};

type StaffMemberAttributes = {
  full_name: string;
  job_title: string;
  photo: any; // Flexible to handle various Strapi response formats
};

type StaffMember = {
  id: number;
  attributes: StaffMemberAttributes;
};

type AcademicDepartment = {
  id: number;
  attributes: {
    name: string;
    description: Block[] | null;
    hod: any; // Flexible to handle both nested and flat Strapi structures
    order: number | null;
  };
};

type DepartmentsResponse = {
  data: AcademicDepartment[];
};

export default async function DepartmentsPage() {
  let departments: AcademicDepartment[] = [];

  try {
    const response = await fetchFromStrapi<DepartmentsResponse>(
      "/academic-departments?populate[hod][populate]=*&sort=order:asc"
    );

    departments = response.data || [];

    // Check if data structure is flat (like admission requirements)
    if (departments.length > 0 && !departments[0].attributes) {
      // Data is flat, need to transform it
      departments = departments.map((d: any) => ({
        id: d.id,
        attributes: {
          name: d.name,
          description: d.description,
          hod: d.hod,
          order: d.order,
        },
      })) as AcademicDepartment[];
    }
  } catch (error) {
    console.error("Error loading departments data:", error);
    // Continue rendering with empty array
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--school-grey)" }}>
      {/* Hero Section with Header */}
      <section className="relative">
        <Header />
        <PageHero 
          title="Academic Departments"
          subtitle="Explore our comprehensive academic structure"
        />
      </section>

      {/* Gradient Wrapper for Content Sections */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(110, 193, 228, 0.25) 15%, rgba(110, 193, 228, 0.35) 35%, rgba(10, 31, 68, 0.15) 60%, rgba(10, 31, 68, 0.08) 80%, rgba(255, 255, 255, 1) 100%)"
        }}
      >
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {departments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-700 text-lg">No departments available.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {departments.map((dept) => {
                // Handle both nested and flat HOD data structures
                const hodRaw = dept.attributes.hod;
                const hodData = hodRaw?.data || hodRaw;
                
                // Normalize to have an attributes property
                let hod: { attributes: StaffMemberAttributes } | null = null;
                if (hodData) {
                  if (hodData.attributes) {
                    hod = hodData;
                  } else if (hodData.full_name) {
                    // Flat structure - wrap it
                    hod = { attributes: hodData };
                  }
                }
                
                // Handle both nested and flat photo structures
                let hodPhotoUrl: string | null = null;
                if (hod?.attributes?.photo) {
                  const photo = hod.attributes.photo;
                  // Nested: photo.data[0].attributes.url
                  if (photo?.data?.[0]?.attributes?.url) {
                    hodPhotoUrl = getStrapiMediaUrl(photo.data[0].attributes.url);
                  // Nested single: photo.data.attributes.url
                  } else if (photo?.data?.attributes?.url) {
                    hodPhotoUrl = getStrapiMediaUrl(photo.data.attributes.url);
                  // Flat array: photo[0].url
                  } else if (Array.isArray(photo) && photo[0]?.url) {
                    hodPhotoUrl = getStrapiMediaUrl(photo[0].url);
                  // Flat: photo.url
                  } else if (photo?.url) {
                    hodPhotoUrl = getStrapiMediaUrl(photo.url);
                  }
                }

              return (
                <div
                  key={dept.id}
                  className="bg-white rounded-lg shadow-md p-8"
                >
                  <h2
                    className="text-3xl font-bold mb-4"
                    style={{ color: "var(--school-navy)" }}
                  >
                    {dept.attributes.name}
                  </h2>

                  {dept.attributes.description && (
                    <div className="prose max-w-none mb-6">
                      {renderBlocks(dept.attributes.description)}
                    </div>
                  )}

                  {hod && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <h3
                        className="text-xl font-semibold mb-4"
                        style={{ color: "var(--school-navy)" }}
                      >
                        Head of Department
                      </h3>
                      <div className="flex items-start gap-4">
                        {hodPhotoUrl && (
                          <img
                            src={hodPhotoUrl}
                            alt={hod.attributes.full_name}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-lg">{hod.attributes.full_name}</p>
                          <p className="text-slate-600">{hod.attributes.job_title}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        </div>
      </section>
      </div>

      <Footer />
    </main>
  );
}
