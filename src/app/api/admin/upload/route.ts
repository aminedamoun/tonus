import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'aminedamoun';
const REPO_NAME = 'tonus';
const BRANCH = 'main';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function getFileSha(path: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha;
}

async function commitFile(path: string, base64Content: string, message: string) {
  const sha = await getFileSha(path);
  const body: Record<string, string> = {
    message,
    content: base64Content,
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

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = (formData.get('folder') as string) || 'menu';

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB' }, { status: 400 });
    }

    const filename = `${Date.now()}-${randomString(6)}.webp`;
    const targetPath = `public/assets/images/${folder}/${filename}`;

    const arrayBuffer = await file.arrayBuffer();
    const base64Content = Buffer.from(arrayBuffer).toString('base64');

    await commitFile(targetPath, base64Content, `Upload image ${filename} via admin panel`);

    const url = `/assets/images/${folder}/${filename}`;
    const previewUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${targetPath}`;

    return NextResponse.json({ success: true, url, previewUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
