import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchFromStrapi, getStrapiMediaUrl } from "@/lib/strapi";
import { renderBlocks } from "@/lib/render-blocks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const albumId = parseInt(id, 10);

  if (isNaN(albumId)) {
    return {
      title: "Gallery Album",
      description: "View our gallery album",
    };
  }

  try {
    const allResponse = await fetchFromStrapi<any>(
      `/gallery-albums?populate[gallery_items][populate]=*`
    );

    const found = allResponse.data?.find((album: any) => album.id === albumId);
    
    if (found) {
      const title = found.attributes?.title || (found as any).title;
      return {
        title: title || "Gallery Album",
        description: `View photos from ${title}`,
        openGraph: {
          title: title || "Gallery Album",
          description: `View photos from ${title}`,
        },
      };
    }
  } catch {
    // Fall through to default
  }

  return {
    title: "Gallery Album",
    description: "View our gallery album",
  };
}

type Block = {
  type: string;
  children?: Array<{ type: string; text?: string; bold?: boolean; italic?: boolean; underline?: boolean }>;
  level?: number;
  format?: string;
};

type Media = {
  url: string;
};

type GalleryItem = {
  id: number;
  attributes: {
    title: string | null;
    caption: string | null;
    image: { data: { attributes: Media } | null } | null;
    order: number | null;
  };
};

type GalleryAlbum = {
  id: number;
  attributes: {
    title: string;
    description: Block[] | null;
    cover_image: { data: { attributes: Media } | null } | null;
    event_date: string | null;
    gallery_items: { data: GalleryItem[] } | null;
  };
};

type GalleryAlbumResponse = {
  data: GalleryAlbum[];
};

export default async function GalleryAlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const albumId = parseInt(id, 10);
  
  if (isNaN(albumId)) {
    notFound();
  }

  let response: any;
  
  try {
    // Fetch all albums and filter by ID (more reliable with flat structure)
    const allResponse = await fetchFromStrapi<any>(
      `/gallery-albums?populate[gallery_items][populate]=*`
    );

    if (process.env.NODE_ENV === "development") {
      console.log("All albums response:", JSON.stringify(allResponse, null, 2));
      console.log("Looking for album ID:", albumId);
    }

    let albums = allResponse.data || [];

    // Check if data structure is flat
    if (albums.length > 0 && !albums[0].attributes) {
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
      }));
    }

    // Find the album with matching ID
    const found = albums.find((album: any) => album.id === albumId);

    if (!found) {
      if (process.env.NODE_ENV === "development") {
        console.log("Album not found. Available IDs:", albums.map((a: any) => a.id));
      }
      notFound();
    }

    response = { data: [found] };
  } catch (error) {
    console.error("Error fetching gallery album:", error);
    notFound();
  }

  if (!response.data || response.data.length === 0) {
    notFound();
  }

  let album = response.data[0];

  // Check if data structure is flat (like admission requirements)
  if (!album.attributes) {
    // Data is flat, need to transform it
    album = {
      id: (album as any).id,
      attributes: {
        title: (album as any).title,
        description: (album as any).description,
        cover_image: (album as any).cover_image,
        event_date: (album as any).event_date,
        gallery_items: (album as any).gallery_items,
      },
    } as GalleryAlbum;
  }

  // Handle gallery_items - could be flat array or nested structure
  let items: GalleryItem[] = [];
  const galleryItemsData = album.attributes.gallery_items;
  
  if (Array.isArray(galleryItemsData)) {
    // Flat array structure
    items = galleryItemsData.map((item: any) => {
      if (item.attributes) {
        return item;
      }
      // Transform flat item structure
      return {
        id: item.id,
        attributes: {
          title: item.title,
          caption: item.caption,
          image: item.image, // This might be flat or { data: { attributes: ... } }
          order: item.order,
        },
      } as GalleryItem;
    });
  } else if (galleryItemsData?.data) {
    // Nested structure with data wrapper
    items = galleryItemsData.data.map((item: any) => {
      // If items in the data array are flat, transform them
      if (!item.attributes) {
        return {
          id: item.id,
          attributes: {
            title: item.title,
            caption: item.caption,
            image: item.image,
            order: item.order,
          },
        } as GalleryItem;
      }
      return item;
    });
  }

  // Process image fields - handle flat image structure
  items = items.map((item) => {
    const image = item.attributes.image;
    if (image && !image.data) {
      // Image is flat, wrap it
      item.attributes.image = { data: { attributes: image as Media } };
    } else if (image && image.data && !image.data.attributes) {
      // Image.data is flat, wrap it
      item.attributes.image = { data: { attributes: image.data as Media } };
    }
    return item;
  });

  const sortedItems = [...items].sort((a, b) => {
    const orderA = a.attributes.order ?? 999;
    const orderB = b.attributes.order ?? 999;
    return orderA - orderB;
  });

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: "var(--school-grey)" }}
    >
      <Header />

      <section className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6">
        <Link
          href="/gallery"
          className="inline-block mb-6 sm:mb-8 text-slate-600 hover:text-slate-900 text-sm sm:text-base"
        >
          ← Back to Gallery
        </Link>

        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
          style={{ color: "var(--school-navy)" }}
        >
          {album.attributes.title}
        </h1>

        {album.attributes.event_date && (
          <p className="text-slate-600 mb-6">
            {new Date(album.attributes.event_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        {album.attributes.description && (
          <div className="prose prose-lg max-w-none mb-8">
            {renderBlocks(album.attributes.description)}
          </div>
        )}

        {sortedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-700">No photos in this album yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => {
              const imageUrl = item.attributes.image?.data?.attributes?.url
                ? getStrapiMediaUrl(item.attributes.image.data.attributes.url)
                : null;

              if (!imageUrl) return null;

              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={item.attributes.title 
                        ? `${item.attributes.title}${item.attributes.caption ? ` - ${item.attributes.caption}` : ''}`
                        : `Gallery image ${item.id}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {(item.attributes.title || item.attributes.caption) && (
                    <div className="p-4">
                      {item.attributes.title && (
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: "var(--school-navy)" }}
                        >
                          {item.attributes.title}
                        </h3>
                      )}
                      {item.attributes.caption && (
                        <p className="text-sm text-slate-600">{item.attributes.caption}</p>
                      )}
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
