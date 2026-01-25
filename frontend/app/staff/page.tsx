import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import { renderBlocks } from "@/lib/render-blocks";

export const metadata: Metadata = {
  title: "Staff",
  description: "Meet our dedicated staff members and educators who are committed to excellence in education.",
  openGraph: {
    title: "Our Staff - Statehouse School",
    description: "Meet our dedicated staff members and educators.",
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

type StaffMember = {
  id: number;
  attributes: {
    full_name: string;
    job_title: string;
    photo: { data: Array<{ attributes: Media }> | null } | null;
    biography: Block[] | null;
    email: string | null;
    phone: string | null;
    order: number | null;
  };
};

type StaffCategory = {
  id: number;
  attributes: {
    name: string;
    description: Block[] | null;
    staff_members: { data: StaffMember[] } | null;
  };
};

type StaffCategoriesResponse = {
  data: StaffCategory[];
};

export default async function StaffPage() {
  let categories: StaffCategory[] = [];

  try {
    const response = await fetchFromStrapi<StaffCategoriesResponse>(
      "/staff-categories?populate[staff_members][populate]=*"
    );

    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("Staff categories response:", JSON.stringify(response, null, 2));
    }

    categories = response.data || [];

    // Check if data structure is flat (like admission requirements)
    if (categories.length > 0 && !categories[0].attributes) {
      // Data is flat, need to transform it
      categories = categories.map((c: any) => ({
        id: c.id,
        attributes: {
          name: c.name,
          description: c.description,
          staff_members: c.staff_members,
        },
      })) as StaffCategory[];
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Processed categories:", categories);
      console.log("Categories count:", categories.length);
      categories.forEach((cat, idx) => {
        console.log(`Category ${idx}:`, cat.attributes.name, "Members:", cat.attributes.staff_members?.data?.length || 0);
      });
    }
  } catch (error) {
    console.error("Error loading staff data:", error);
    if (process.env.NODE_ENV === "development") {
      console.error("Full error:", error);
    }
    // Continue rendering with empty array
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--school-grey)" }}>
      {/* Hero Section with Header */}
      <section className="relative">
        <Header />
        <PageHero 
          title="Our Staff"
          subtitle="Meet our dedicated educators committed to excellence"
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
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-700 text-lg">Staff information coming soon.</p>
              <p className="text-sm text-slate-500 mt-2">
                Please check back later for our staff directory.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map((category) => {
                // Handle both { data: [...] } and flat array structures
                const staffMembersData = category.attributes.staff_members;
                const membersArray = Array.isArray(staffMembersData) 
                  ? staffMembersData 
                  : (staffMembersData?.data || []);
                
                // Transform flat structure to expected structure if needed
                const members = membersArray.map((member: any) => {
                // If member is already in the expected format with attributes, return as is
                if (member.attributes) {
                  return member;
                }
                // Transform flat structure to expected structure if needed
                return {
                  id: member.id,
                  attributes: {
                    full_name: member.full_name,
                    job_title: member.job_title,
                    photo: member.photo, // Keep the photo field as-is, we'll handle various structures when rendering
                    biography: member.biography,
                    email: member.email,
                    phone: member.phone,
                    order: member.order,
                  },
                };
              });
              
              const sortedMembers = [...members].sort((a, b) => {
                const orderA = a.attributes.order ?? 999;
                const orderB = b.attributes.order ?? 999;
                return orderA - orderB;
              });

              if (sortedMembers.length === 0) return null;

              return (
                <div key={category.id}>
                  <h2
                    className="text-3xl font-bold mb-4"
                    style={{ color: "var(--school-navy)" }}
                  >
                    {category.attributes.name}
                  </h2>
                  {category.attributes.description && (
                    <div className="prose max-w-none mb-6">
                      {renderBlocks(category.attributes.description)}
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedMembers.map((member) => {
                      // Handle both nested and flat photo structures
                      let photoUrl = null;
                      const photo = member.attributes.photo;
                      if (photo) {
                        // Nested: photo.data[0].attributes.url
                        if (photo?.data?.[0]?.attributes?.url) {
                          photoUrl = getStrapiMediaUrl(photo.data[0].attributes.url);
                        // Nested single: photo.data.attributes.url
                        } else if (photo?.data?.attributes?.url) {
                          photoUrl = getStrapiMediaUrl(photo.data.attributes.url);
                        // Flat array: photo[0].url
                        } else if (Array.isArray(photo) && photo[0]?.url) {
                          photoUrl = getStrapiMediaUrl(photo[0].url);
                        // Flat: photo.url
                        } else if (photo?.url) {
                          photoUrl = getStrapiMediaUrl(photo.url);
                        }
                      }

                      return (
                        <div
                          key={member.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                          {photoUrl ? (
                            <div className="aspect-square overflow-hidden">
                              <img
                                src={photoUrl}
                                alt={`${member.attributes.full_name}${member.attributes.job_title ? ` - ${member.attributes.job_title}` : ''}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            </div>
                          ) : (
                            <div
                              className="aspect-square flex items-center justify-center"
                              style={{ backgroundColor: "var(--school-grey-strong)" }}
                            >
                              <span className="text-slate-400">No Photo</span>
                            </div>
                          )}
                          <div className="p-6">
                            <h3
                              className="text-xl font-bold mb-1"
                              style={{ color: "var(--school-navy)" }}
                            >
                              {member.attributes.full_name}
                            </h3>
                            <p className="text-slate-600 mb-3">{member.attributes.job_title}</p>
                            {member.attributes.biography && (
                              <div className="prose prose-sm max-w-none text-slate-700">
                                {renderBlocks(member.attributes.biography)}
                              </div>
                            )}
                            {(member.attributes.email || member.attributes.phone) && (
                              <div className="mt-4 pt-4 border-t border-slate-200">
                                {member.attributes.email && (
                                  <p className="text-sm text-slate-600">
                                    <strong>Email:</strong>{" "}
                                    <a
                                      href={`mailto:${member.attributes.email}`}
                                      className="text-blue-600 hover:underline"
                                    >
                                      {member.attributes.email}
                                    </a>
                                  </p>
                                )}
                                {member.attributes.phone && (
                                  <p className="text-sm text-slate-600">
                                    <strong>Phone:</strong> {member.attributes.phone}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
