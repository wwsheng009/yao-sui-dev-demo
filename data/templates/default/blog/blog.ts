/* data/templates/default/blog/blog.ts */
import { Component, EventData, EventDetail, $Backend } from '@yao/sui';
const self = this as Component;

self.once = async function () {
  console.log('Blog page initialized');
};

self.LoadCategory = async (event: Event, data: EventData) => {
  try {
    const category = data['category'];
    const articles = await $Backend('/blog').Call('GetArticles', category);
    self.store.SetJSON('articles', { category, items: articles });
    await self.render('articles-list', { articles });
  } catch (error) {
    console.error('Error loading category:', error);
    alert('Failed to load articles.');
  }
};

self.SubmitComment = async (event: Event) => {
  event.preventDefault();
  try {
    const comment = self.store.GetJSON('comment');
    if (!comment.author || !comment.content) {
      throw new Error('Author and content are required');
    }
    const newComment = await $Backend('/blog').Call('AddComment', comment);
    const comments = self.store.GetJSON('comments') || [];
    comments.push(newComment);
    self.store.SetJSON('comments', comments);
    self.store.SetJSON('comment', { author: '', content: '' });
    await self.render('comments-list', { comments });
  } catch (error) {
    console.error('Error submitting comment:', error);
    alert('Failed to submit comment.');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  console.log('Blog page data:', __sui_data);
});