import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database', 'articles.json');

export interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
}

export const getArticles = (): Article[] => {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return [];
  }
};

export const saveArticles = (articles: Article[]) => {
  try {
    // Vercel has a read-only file system. 
    // This will only work in local development or platforms with persistent FS.
    if (process.env.VERCEL) {
      console.warn('Cannot save articles on Vercel (Read-only File System)');
      return false;
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(articles, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing DB:', error);
    return false;
  }
};

export const getArticleById = (id: string): Article | undefined => {
  const articles = getArticles();
  return articles.find(a => a.id === id);
};

export const addArticle = (article: Omit<Article, 'id'>) => {
  const articles = getArticles();
  const newArticle: Article = {
    ...article,
    id: Date.now().toString(),
  };
  articles.unshift(newArticle);
  const success = saveArticles(articles);
  return success ? newArticle : null;
};
