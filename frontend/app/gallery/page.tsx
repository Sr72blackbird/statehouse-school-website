import Link from "next/link";
import Header from "@/components/Header";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";

type Media = {
  url: string;
};

type GalleryAlbum = {
  id: number;
  attributes: {
    title: string;
    description: any;
    cover_image: { data: { attributes: Media } | null } | null;
    event_date: string | null;
    order: number | null;
    gallery_items: { data: Array<{ id: number }> } | null;
  };
};

type GalleryAlbumsResponse = {
  data: GalleryAlbum[];
};

export default async function GalleryPage() {
  const response = await fetchFromStrapi<GalleryAlbumsResponse>(
    "/gallery-albums?populate=*&sort=order:asc,event_date:desc"
  );

  let albums = response.data || [];

  // Check if data structure is flat (like admission requirements)
  if (albums.length > 0 && !albums[0].attributes) {
    // Data is flat, need to transform it
    albums = albums.map((album: any) => ({
      id: album.id,
      attributes: {
        title: album.title,
        description: album.description,
        cover_image: album.cover_image,
        event_date: album.event_date,
        order: album.order,
        gallery_items: album.gallery_items,
      },
    })) as GalleryAlbum[];
  }

  // Process cover_image fields - handle various image structures
  albums = albums.map((album: any) => {
    const coverImage = album.attributes.cover_image;
    
    if (process.env.NODE_ENV === "development" && coverImage) {
      console.log(`Album ${album.id} cover_image structure:`, JSON.stringify(coverImage, null, 2));
    }
    
    if (!coverImage) {
      return album;
    }
    
    // Already in correct format
    if (coverImage.data && coverImage.data.attributes && coverImage.data.attributes.url) {
      return album;
    }
    
    // Image is flat object with url directly
    if (coverImage.url && !coverImage.data) {
      album.attributes.cover_image = { data: { attributes: { url: coverImage.url } } };
      return album;
    }
    
    // Image.data exists but is flat (no attributes wrapper)
    if (coverImage.data && coverImage.data.url && !coverImage.data.attributes) {
      album.attributes.cover_image = { data: { attributes: { url: coverImage.data.url } } };
      return album;
    }
    
    // Image.data is an array (multiple images, take first)
    if (coverImage.data && Array.isArray(coverImage.data) && coverImage.data.length > 0) {
      const firstImage = coverImage.data[0];
      if (firstImage.attributes && firstImage.attributes.url) {
        album.attributes.cover_image = { data: { attributes: { url: firstImage.attributes.url } } };
      } else if (firstImage.url) {
        album.attributes.cover_image = { data: { attributes: { url: firstImage.url } } };
      }
      return album;
    }
    
    // Image is an array (shouldn't happen, but handle it)
    if (Array.isArray(coverImage) && coverImage.length > 0) {
      const firstImage = coverImage[0];
      if (firstImage.attributes && firstImage.attributes.url) {
        album.attributes.cover_image = { data: { attributes: { url: firstImage.attributes.url } } };
      } else if (firstImage.url) {
        album.attributes.cover_image = { data: { attributes: { url: firstImage.url } } };
      }
      return album;
    }
    
    return album;
  });

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
          Gallery
        </h1>

        {albums.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-700 text-lg">No gallery albums at this time.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => {
              // Try multiple paths to get cover image URL
              let coverUrl: string | null = null;
              const coverImage = album.attributes.cover_image;
              
              if (coverImage) {
                // Standard nested structure
                if (coverImage.data?.attributes?.url) {
                  coverUrl = getStrapiMediaUrl(coverImage.data.attributes.url);
                }
                // Flat structure
                else if (coverImage.url) {
                  coverUrl = getStrapiMediaUrl(coverImage.url);
                }
                // Data is flat
                else if (coverImage.data?.url) {
                  coverUrl = getStrapiMediaUrl(coverImage.data.url);
                }
              }

              if (process.env.NODE_ENV === "development" && !coverUrl && coverImage) {
                console.warn(`No cover image URL found for album ${album.id}:`, JSON.stringify(coverImage, null, 2));
              }

              const itemCount = album.attributes.gallery_items?.data?.length || 0;

              return (
                <Link
                  key={album.id}
                  href={`/gallery/${album.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {coverUrl ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={coverUrl}
                        alt={album.attributes.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="aspect-video flex items-center justify-center"
                      style={{ backgroundColor: "var(--school-grey-strong)" }}
                    >
                      <span className="text-slate-400">No Image</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h2
                      className="text-xl font-bold mb-2"
                      style={{ color: "var(--school-navy)" }}
                    >
                      {album.attributes.title}
                    </h2>
                    {album.attributes.event_date && (
                      <p className="text-sm text-slate-600 mb-2">
                        {new Date(album.attributes.event_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    {itemCount > 0 && (
                      <p className="text-sm text-slate-500">
                        {itemCount} {itemCount === 1 ? "photo" : "photos"}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
