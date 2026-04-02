import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'aminedamoun';
const REPO_NAME = 'tonus';
const BRANCH = 'main';

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
    // Simple auth check
    const adminPassword = process.env.ADMIN_PASSWORD || 'tonos2024';
    const authHeader = request.headers.get('x-admin-password');
    if (authHeader !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 });
    }

    const { file, data, message } = await request.json();

    const allowedFiles = [
      'src/data/menu-items.json',
      'src/data/menu-categories.json',
      'src/data/offers.json',
      'src/data/gallery-images.json',
      'src/data/about-gallery-images.json',
      'src/data/hero-ad-blocks.json',
    ];

    if (!allowedFiles.includes(file)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    const content = JSON.stringify(data, null, 2);
    const commitMessage = message || `Update ${file.split('/').pop()} via admin panel`;

    await commitFile(file, content, commitMessage);

    return NextResponse.json({ success: true, message: 'Saved and deploying...' });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Save failed' },
      { status: 500 }
    );
  }
}
