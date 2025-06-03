import { Request, Store } from '@yao/sui';

// Initialize demo data
function initDemoData() {
  const store = new Store('cache');
  const categories = [
    {
      name: 'Technology',
      icon: '🖥️',
      count: 3,
      description: 'Latest tech trends and innovations'
    },
    {
      name: 'Lifestyle',
      icon: '🌿',
      count: 2,
      description: 'Tips for a balanced and healthy life'
    },
    {
      name: 'Travel',
      icon: '✈️',
      count: 1,
      description: 'Explore new destinations and cultures'
    }
  ];
  const articles = {
    category: 'Technology', // Default category
    items: [
      {
        id: '1',
        category: 'Technology',
        title: 'The Future of AI',
        content: 'Artificial Intelligence is transforming industries...',
        publish_date: '2025-05-20T10:00:00Z',
        views: 1200,
        likes: 45,
        tags: ['AI', 'Tech', 'Innovation']
      },
      {
        id: '2',
        category: 'Technology',
        title: 'Quantum Computing Explained',
        content: 'Quantum computing is a revolutionary technology...',
        publish_date: '2025-05-18T09:00:00Z',
        views: 800,
        likes: 20,
        tags: ['Quantum', 'Tech']
      },
      {
        id: '3',
        category: 'Technology',
        title: '5G and Beyond',
        content: 'The next generation of wireless networks...',
        publish_date: '2025-05-15T14:00:00Z',
        views: 600,
        likes: 15,
        tags: ['5G', 'Networking']
      },
      {
        id: '4',
        category: 'Lifestyle',
        title: 'Mindfulness Practices',
        content: 'Incorporate mindfulness into your daily routine...',
        publish_date: '2025-05-10T08:00:00Z',
        views: 400,
        likes: 10,
        tags: ['Mindfulness', 'Health']
      },
      {
        id: '5',
        category: 'Lifestyle',
        title: 'Sustainable Living',
        content: 'Eco-friendly habits for a greener planet...',
        publish_date: '2025-05-08T12:00:00Z',
        views: 350,
        likes: 8,
        tags: ['Sustainability', 'Lifestyle']
      },
      {
        id: '6',
        category: 'Travel',
        title: 'Top Destinations in 2025',
        content: 'Discover the best places to visit this year...',
        publish_date: '2025-05-05T11:00:00Z',
        views: 500,
        likes: 25,
        tags: ['Travel', 'Adventure']
      }
    ]
  };
  const comments = [
    {
      id: '1',
      author: 'Alice',
      content: 'Great article on AI! Very insightful.',
      create_time: '2025-05-20T12:00:00Z',
      avatar: '/assets/images/avatars/alice.jpg',
      replies: [
        {
          author: 'Bob',
          content: 'Thanks for sharing, Alice!',
          create_time: '2025-05-20T12:30:00Z'
        }
      ]
    },
    {
      id: '2',
      author: 'Charlie',
      content: 'I learned a lot about quantum computing.',
      create_time: '2025-05-18T10:00:00Z',
      avatar: '/assets/images/avatars/charlie.jpg',
      replies: []
    }
  ];

  // Initialize data if not already set
  if (!store.Get('categories')) {
    store.Set('categories', categories);
  }
  if (!store.Get('articles')) {
    store.Set('articles', articles);
  }
  if (!store.Get('comments')) {
    store.Set('comments', comments);
  }
}

// Save data to store
function saveCategories(categories: any[]) {
  new Store('cache').Set('categories', categories);
}

function saveArticles(articles: any) {
  new Store('cache').Set('articles', articles);
}

function saveComments(comments: any[]) {
  new Store('cache').Set('comments', comments);
}

// Get all categories
function GetCategories(request: Request) {
  initDemoData();
  return new Store('cache').Get('categories') || [];
}

// 页面初始化调用
function GetArticles(request: Request) {
  initDemoData();
  const articles = new Store('cache').Get('articles') || { category: 'Technology', items: [] };
  // Set default category if not provided
  const selectedCategory = 'Technology';
  const filteredItems = articles.items.filter((a: any) => a.category === selectedCategory)
  
  return {
    category: selectedCategory,
    items: filteredItems
  };
}
// api调用重新渲染
// Get articles by category
function ApiGetArticles(category?: string) {

  initDemoData();
  const articles = new Store('cache').Get('articles') || { category: 'Technology', items: [] };
  // Set default category if not provided
  const selectedCategory = category || articles.category || 'Technology';
  const filteredItems = category
    ? articles.items.filter((a: any) => a.category === category)
    : articles.items;
  return {
    category: selectedCategory,
    items: filteredItems
  };
}

// Get all comments
function GetComments(request: Request) {
  initDemoData();
  return new Store('cache').Get('comments') || [];
}

// Add a new comment
function ApiAddComment(comment: { author: string; content: string }) {
  if (!comment.author || !comment.content) {
    throw new Exception('Author and content are required', 400);
  }
  const comments = new Store('cache').Get('comments') || [];
  const newComment = {
    id: (comments.length + 1).toString(),
    author: comment.author,
    content: comment.content,
    create_time: new Date().toISOString(),
    avatar: '/assets/images/avatars/default.jpg',
    replies: []
  };
  comments.push(newComment);
  saveComments(comments);
  return newComment;
}