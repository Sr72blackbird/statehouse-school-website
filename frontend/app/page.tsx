import Header from "@/components/Header";

export default function Home() {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--school-grey)" }}
    >
      <Header />

      {/* Placeholder main content */}
      <section className="max-w-5xl mx-auto py-20 px-6 text-center">
        <h2
          className="text-4xl font-bold"
          style={{ color: "var(--school-navy)" }}
        >
          Welcome to State House Boys High School
        </h2>
        <p className="mt-6 text-slate-700">
          A national boys’ school committed to academic excellence, discipline,
          innovation, and holistic development under the CBC curriculum.
        </p>
      </section>
    </main>
  );
}
