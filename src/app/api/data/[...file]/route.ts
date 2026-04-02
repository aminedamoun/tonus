import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'aminedamoun';
const REPO_NAME = 'tonus';
const BRANCH = 'main';

const ALLOWED_FILES = [
  'menu-items.json',
  'menu-categories.json',
  'offers.json',
  'gallery-images.json',
  'about-gallery-images.json',
  'hero-ad-blocks.json',
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string[] }> }
) {
  const { file } = await params;
  const filename = file.join('/');

  if (!ALLOWED_FILES.includes(filename)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const githubUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/src/data/${filename}?ref=${BRANCH}`;
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3.raw',
      'User-Agent': 'tonus-site',
    };
    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const res = await fetch(githubUrl, {
      headers,
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new Error(`GitHub API: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5',
      },
    });
  } catch (error) {
    console.error('Data fetch error:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
