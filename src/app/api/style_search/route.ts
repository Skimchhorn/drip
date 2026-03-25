import { NextRequest, NextResponse } from "next/server";
import { mockGalleryImages } from "@/lib/mockData";
// Style search is intentionally local-only and returns hardcoded gallery models.

function getSearchableText(title: string, tags: string[]): string {
  return `${title} ${tags.join(" ")}`.toLowerCase();
}

// Transform mock data to match API response format
function transformMockDataToApiResponse(query: string, num: string, start: string) {
  const numResults = parseInt(num, 10);
  const startIndex = parseInt(start, 10);
  const normalizedQuery = query.trim().toLowerCase();

  const queryMatchedImages = normalizedQuery
    ? mockGalleryImages.filter((image) =>
        getSearchableText(image.title, image.tags).includes(normalizedQuery)
      )
    : mockGalleryImages;

  const slicedMocks = queryMatchedImages.slice(startIndex - 1, startIndex - 1 + numResults);
  
  return {
    query,
    total: slicedMocks.length,
    nextStart: startIndex + numResults <= queryMatchedImages.length ? startIndex + numResults : null,
    images: slicedMocks.map(mock => ({
      title: mock.title,
      url: mock.imageUrl,
      thumb: mock.imageUrl,
      pageUrl: mock.imageUrl,
      width: 1080,
      height: 1080,
      mime: "image/jpeg"
    })),
    source: "mock"
  };
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 });

  const num = req.nextUrl.searchParams.get("num") ?? "10";
  const start = req.nextUrl.searchParams.get("start") ?? "1";

  const mockResponse = transformMockDataToApiResponse(q, num, start);
  return NextResponse.json(mockResponse);
}
