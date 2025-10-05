import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 });

  const num = req.nextUrl.searchParams.get("num") ?? "10";
  const start = req.nextUrl.searchParams.get("start") ?? "1";
  const imgSize = req.nextUrl.searchParams.get("imgSize") ?? undefined;
  const imgType = req.nextUrl.searchParams.get("imgType") ?? undefined;
  const safe = req.nextUrl.searchParams.get("safe") ?? "active";
  const rights = req.nextUrl.searchParams.get("rights") ?? undefined;
  const fileType = req.nextUrl.searchParams.get("fileType") ?? undefined;

  const params = new URLSearchParams({
    key: process.env.GOOGLE_SEARCH_API_KEY!,
    cx: process.env.GOOGLE_CSE_CX!,
    q,
    searchType: "image",
    num,
    start,
    safe
  });
  if (imgSize) params.set("imgSize", imgSize);
  if (imgType) params.set("imgType", imgType);
  if (rights)  params.set("rights", rights);
  if (fileType) params.set("fileType", fileType);

  const r = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
  const json = await r.json();

  if (!r.ok) return NextResponse.json({ error: json }, { status: r.status });

  const images = (json.items ?? []).map((it: any) => ({
    title: it.title,
    url: it.link,
    thumb: it.image?.thumbnailLink ?? null,
    pageUrl: it.image?.contextLink ?? null,
    width: it.image?.width ?? null,
    height: it.image?.height ?? null,
    mime: it.mime ?? it.image?.mime ?? null
  }));

  return NextResponse.json({
    query: q,
    total: images.length,
    nextStart: json.queries?.nextPage?.[0]?.startIndex ?? null,
    images
  });
}
