import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import { renderBlocks } from "@/lib/render-blocks";

type Block = {
  type: string;
  children?: Array<{ type: string; text?: string; bold?: boolean; italic?: boolean; underline?: boolean }>;
  level?: number;
  format?: string;
};

type Media = {
  url: string;
};

type StaffMember = {
  id: number;
  attributes: {
    full_name: string;
    job_title: string;
    photo: { data: Array<{ attributes: Media }> | null } | null;
  };
};

type AcademicDepartment = {
  id: number;
  attributes: {
    name: string;
    description: Block[] | null;
    hod: { data: StaffMember | null } | null;
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
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--school-grey)" }}
    >
      <Header />

      <section className="max-w-6xl mx-auto py-16 px-6">
        <h1
          className="text-5xl font-bold mb-12 text-center"
          style={{ color: "var(--school-navy)" }}
        >
          Academic Departments
        </h1>

        {departments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-700 text-lg">No departments available.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {departments.map((dept) => {
              const hod = dept.attributes.hod?.data;
              const hodPhotoUrl = hod?.attributes.photo?.data?.[0]?.attributes?.url
                ? getStrapiMediaUrl(hod.attributes.photo.data[0].attributes.url)
                : null;

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
      </section>

      <Footer />
    </main>
  );
}
