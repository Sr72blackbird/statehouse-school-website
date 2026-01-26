import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Downloads",
  description: "Download important documents such as Fees Structure, Tenders, and other PDFs.",
  openGraph: {
    title: "Downloads - Statehouse School",
    description: "Download important documents such as Fees Structure, Tenders, and other PDFs.",
  },
};

const downloads = [
  {
    title: "Fees Structure",
    url: "/pdfs/fees-structure.pdf",
    description: "Current school fees structure."
  },
  {
    title: "Tenders",
    url: "/pdfs/tenders.pdf",
    description: "Open tenders and procurement documents."
  },
  // Add more documents as needed
];

export default function DownloadsPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--school-grey)" }}>
      <Header />
      <PageHero title="Downloads" subtitle="Important documents and resources" />
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--school-navy)" }}>
            Downloadable Documents
          </h2>
          <ul className="space-y-6">
            {downloads.map((doc) => (
              <li key={doc.title} className="bg-white rounded shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-lg mb-1">{doc.title}</div>
                  <div className="text-slate-600 text-sm mb-2">{doc.description}</div>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  download
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
}
