// Local fallback mock gallery — 50 portrait-oriented, free-to-use images from Unsplash Source
// These use the Unsplash Source endpoint with a stable size (900x1200, 3:4) and a sig
// parameter to pick different photos for each entry. Unsplash photos are free to use under
// the Unsplash license; if you prefer Pexels or Pixabay replace the URLs accordingly.

export interface MockImageEntry {
  id: number;
  url: string;
  width: number;
  height: number;
  title?: string;
}

// Generate 50 seeded Unsplash Source queries. These return high-quality portrait images
// matching the query 'fashion,street,portrait'. The sig parameter makes each URL produce
// a different photo while keeping a consistent size/aspect ratio.
export const mockGalleryImages: MockImageEntry[] = [
  { id: 1, url: '/mock-portraits/portrait-001.jpg', width: 900, height: 1200, title: 'Magazine Look #1' },
  { id: 2, url: '/mock-portraits/portrait-002.jpg', width: 900, height: 1200, title: 'Magazine Look #2' },
  { id: 3, url: '/mock-portraits/portrait-003.jpg', width: 900, height: 1200, title: 'Magazine Look #3' },
  { id: 4, url: '/mock-portraits/portrait-004.jpg', width: 900, height: 1200, title: 'Magazine Look #4' },
  { id: 5, url: '/mock-portraits/portrait-005.jpg', width: 900, height: 1200, title: 'Magazine Look #5' },
  { id: 6, url: '/mock-portraits/portrait-006.jpg', width: 900, height: 1200, title: 'Magazine Look #6' },
  { id: 7, url: '/mock-portraits/portrait-007.jpg', width: 900, height: 1200, title: 'Magazine Look #7' },
  { id: 8, url: '/mock-portraits/portrait-008.jpg', width: 900, height: 1200, title: 'Magazine Look #8' },
  { id: 9, url: '/mock-portraits/portrait-009.jpg', width: 900, height: 1200, title: 'Magazine Look #9' },
  { id: 10, url: '/mock-portraits/portrait-010.jpg', width: 900, height: 1200, title: 'Magazine Look #10' },
  { id: 11, url: '/mock-portraits/portrait-011.jpg', width: 900, height: 1200, title: 'Magazine Look #11' },
  { id: 12, url: '/mock-portraits/portrait-012.jpg', width: 900, height: 1200, title: 'Magazine Look #12' },
  { id: 13, url: '/mock-portraits/portrait-013.jpg', width: 900, height: 1200, title: 'Magazine Look #13' },
  { id: 14, url: '/mock-portraits/portrait-014.jpg', width: 900, height: 1200, title: 'Magazine Look #14' },
  { id: 15, url: '/mock-portraits/portrait-015.jpg', width: 900, height: 1200, title: 'Magazine Look #15' },
  { id: 16, url: '/mock-portraits/portrait-016.jpg', width: 900, height: 1200, title: 'Magazine Look #16' },
  { id: 17, url: '/mock-portraits/portrait-017.jpg', width: 900, height: 1200, title: 'Magazine Look #17' },
  { id: 18, url: '/mock-portraits/portrait-018.jpg', width: 900, height: 1200, title: 'Magazine Look #18' },
  { id: 19, url: '/mock-portraits/portrait-019.jpg', width: 900, height: 1200, title: 'Magazine Look #19' },
  { id: 20, url: '/mock-portraits/portrait-020.jpg', width: 900, height: 1200, title: 'Magazine Look #20' },
  { id: 21, url: '/mock-portraits/portrait-021.jpg', width: 900, height: 1200, title: 'Magazine Look #21' },
  { id: 22, url: '/mock-portraits/portrait-022.jpg', width: 900, height: 1200, title: 'Magazine Look #22' },
  { id: 23, url: '/mock-portraits/portrait-023.jpg', width: 900, height: 1200, title: 'Magazine Look #23' },
  { id: 24, url: '/mock-portraits/portrait-024.jpg', width: 900, height: 1200, title: 'Magazine Look #24' },
  { id: 25, url: '/mock-portraits/portrait-025.jpg', width: 900, height: 1200, title: 'Magazine Look #25' },
  { id: 26, url: '/mock-portraits/portrait-026.jpg', width: 900, height: 1200, title: 'Magazine Look #26' },
  { id: 27, url: '/mock-portraits/portrait-027.jpg', width: 900, height: 1200, title: 'Magazine Look #27' },
  { id: 28, url: '/mock-portraits/portrait-028.jpg', width: 900, height: 1200, title: 'Magazine Look #28' },
  { id: 29, url: '/mock-portraits/portrait-029.jpg', width: 900, height: 1200, title: 'Magazine Look #29' },
  { id: 30, url: '/mock-portraits/portrait-030.jpg', width: 900, height: 1200, title: 'Magazine Look #30' },
  { id: 31, url: '/mock-portraits/portrait-031.jpg', width: 900, height: 1200, title: 'Magazine Look #31' },
  { id: 32, url: '/mock-portraits/portrait-032.jpg', width: 900, height: 1200, title: 'Magazine Look #32' },
  { id: 33, url: '/mock-portraits/portrait-033.jpg', width: 900, height: 1200, title: 'Magazine Look #33' },
  { id: 34, url: '/mock-portraits/portrait-034.jpg', width: 900, height: 1200, title: 'Magazine Look #34' },
  { id: 35, url: '/mock-portraits/portrait-035.jpg', width: 900, height: 1200, title: 'Magazine Look #35' },
  { id: 36, url: '/mock-portraits/portrait-036.jpg', width: 900, height: 1200, title: 'Magazine Look #36' },
  { id: 37, url: '/mock-portraits/portrait-037.jpg', width: 900, height: 1200, title: 'Magazine Look #37' },
  { id: 38, url: '/mock-portraits/portrait-038.jpg', width: 900, height: 1200, title: 'Magazine Look #38' },
  { id: 39, url: '/mock-portraits/portrait-039.jpg', width: 900, height: 1200, title: 'Magazine Look #39' },
  { id: 40, url: '/mock-portraits/portrait-040.jpg', width: 900, height: 1200, title: 'Magazine Look #40' },
  { id: 41, url: '/mock-portraits/portrait-041.jpg', width: 900, height: 1200, title: 'Magazine Look #41' },
  { id: 42, url: '/mock-portraits/portrait-042.jpg', width: 900, height: 1200, title: 'Magazine Look #42' },
  { id: 43, url: '/mock-portraits/portrait-043.jpg', width: 900, height: 1200, title: 'Magazine Look #43' },
  { id: 44, url: '/mock-portraits/portrait-044.jpg', width: 900, height: 1200, title: 'Magazine Look #44' },
  { id: 45, url: '/mock-portraits/portrait-045.jpg', width: 900, height: 1200, title: 'Magazine Look #45' },
  { id: 46, url: '/mock-portraits/portrait-046.jpg', width: 900, height: 1200, title: 'Magazine Look #46' },
  { id: 47, url: '/mock-portraits/portrait-047.jpg', width: 900, height: 1200, title: 'Magazine Look #47' },
  { id: 48, url: '/mock-portraits/portrait-048.jpg', width: 900, height: 1200, title: 'Magazine Look #48' },
  { id: 49, url: '/mock-portraits/portrait-049.jpg', width: 900, height: 1200, title: 'Magazine Look #49' },
  { id: 50, url: '/mock-portraits/portrait-050.jpg', width: 900, height: 1200, title: 'Magazine Look #50' },
];

export default mockGalleryImages;
