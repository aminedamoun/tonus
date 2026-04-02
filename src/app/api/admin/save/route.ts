import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'aminedamoun';
const REPO_NAME = 'tonus';
const BRANCH = 'main';

const ALLOWED_FILES = [
  'src/data/menu-items.json',
  'src/data/menu-categories.json',
  'src/data/offers.json',
  'src/data/gallery-images.json',
  'src/data/about-gallery-images.json',
  'src/data/hero-ad-blocks.json',
];

async function getFileSha(path: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha;
}

async function commitFile(path: string, content: string, message: string) {
  const sha = await getFileSha(path);
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${err}`);
  }
  return res.json();
}

export async function POST(request: NextRequest) {
  try {
    const adminPassword = (process.env.ADMIN_PASSWORD || 'tonos2024').trim();
    const authHeader = (request.headers.get('x-admin-password') || '').trim();
    if (!authHeader || authHeader !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    const body = await request.json();

    // Support both single file { file, data } and multi-file { files: [{ file, data }] }
    const filesToSave: { file: string; data: unknown }[] = body.files
      ? body.files
      : [{ file: body.file, data: body.data }];

    for (const entry of filesToSave) {
      if (!ALLOWED_FILES.includes(entry.file)) {
        return NextResponse.json({ error: `Invalid file: ${entry.file}` }, { status: 400 });
      }
    }

    for (const entry of filesToSave) {
      const content = JSON.stringify(entry.data, null, 2);
      const msg = body.message || `Update ${entry.file.split('/').pop()} via admin panel`;
      await commitFile(entry.file, content, msg);
    }

    return NextResponse.json({ success: true, message: 'Saved and deploying...' });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Save failed' },
      { status: 500 }
    );
  }
}
