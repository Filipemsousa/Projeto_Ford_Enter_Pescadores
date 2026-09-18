import { del, list, put } from '@vercel/blob';

const POSTS_FILE = 'publicacoes/posts.json';

async function readPosts() {
  const { blobs } = await list({ prefix: POSTS_FILE });
  const file = blobs.find((blob) => blob.pathname === POSTS_FILE);
  if (!file) return [];

  const response = await fetch(file.url);
  if (!response.ok) throw new Error('Não foi possível ler as publicações salvas.');
  return response.json();
}

async function writePosts(posts) {
  await put(POSTS_FILE, JSON.stringify(posts), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json; charset=utf-8'
  });
}

export default async function handler(request, response) {
  try {
    if (request.method === 'GET') {
      return response.status(200).json(await readPosts());
    }

    if (request.method === 'POST') {
      const post = request.body;
      if (!post || !post.id) return response.status(400).json({ error: 'Publicação inválida.' });
      const posts = await readPosts();
      posts.push(post);
      await writePosts(posts);
      return response.status(201).json(post);
    }

    if (request.method === 'DELETE') {
      const id = Number(request.query.id);
      if (!id) return response.status(400).json({ error: 'Id inválido.' });
      const posts = await readPosts();
      const updatedPosts = posts.filter((post) => post.id !== id);
      if (updatedPosts.length === posts.length) return response.status(404).json({ error: 'Publicação não encontrada.' });
      await writePosts(updatedPosts);
      return response.status(204).end();
    }

    response.setHeader('Allow', 'GET, POST, DELETE');
    return response.status(405).json({ error: 'Método não permitido.' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Erro ao acessar o armazenamento de publicações.' });
  }
}
