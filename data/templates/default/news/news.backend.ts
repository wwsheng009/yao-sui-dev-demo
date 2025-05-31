function ApiGetNewsList() {
  return [
    { id: 1, title: '新闻1', summary: '摘要1', date: '2023-01-01' },
    { id: 2, title: '新闻2', summary: '摘要2', date: '2023-01-02' }
  ];
}

function ApiGetNewsDetail(id: number) {
  return {
    id,
    title: `新闻${id}`,
    author: '作者',
    date: '2023-01-01',
    content: '新闻详细内容...'
  };
}