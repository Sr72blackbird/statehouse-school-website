import Header from "@/components/Header";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";

type Media = {
  url: string;
};

type AboutSchool = {
  School_name: string;
  history: string | null;
  mission: string | null;
  vision: string | null;
  core_values: string | null;
  established_year: string | null;
  logo: Media | null;
  profile_image: Media | null;
};

type AboutSchoolResponse = {
  data: AboutSchool;
};

export default async function Home() {
  const about = await fetchFromStrapi<AboutSchoolResponse>(
    "/about-the-school?populate=*"
  );

  const data = about.data;

  const logoUrl = getStrapiMediaUrl(data.logo?.url);
  const profileUrl = getStrapiMediaUrl(data.profile_image?.url);

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--school-grey)" }}
    >
      <Header />

      {/* Hero / Intro Section */}
      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2
            className="text-4xl font-bold"
            style={{ color: "var(--school-navy)" }}
          >
            {data.School_name}
          </h2>

          <p className="mt-4 text-slate-700">
            Established in {data.established_year}
          </p>

          {data.history && (
            <p className="mt-6 text-slate-700">
              {data.history}
            </p>
          )}
        </div>

        {profileUrl && (
          <img
            src={profileUrl}
            alt="School"
            className="w-full rounded-lg shadow"
          />
        )}
      </section>

      {/* Mission / Vision */}
      <section
        className="py-16"
        style={{ backgroundColor: "var(--school-grey-strong)" }}
      >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div>
            <h3
              className="text-2xl font-bold"
              style={{ color: "var(--school-navy)" }}
            >
              Our Mission
            </h3>
            <p className="mt-3 text-slate-700">
              {data.mission}
            </p>
          </div>

          <div>
            <h3
              className="text-2xl font-bold"
              style={{ color: "var(--school-navy)" }}
            >
              Our Vision
            </h3>
            <p className="mt-3 text-slate-700">
              {data.vision}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
