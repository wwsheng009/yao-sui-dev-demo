import { Component } from '@yao/sui';
const self = this as Component;

let isDragging = false;
let isResizing = false;
let isMinimized = false;
let offsetX = 0;
let offsetY = 0;
let initialWidth = 0;
let initialHeight = 0;
let initialX = 0;
let initialY = 0;
let savedState = { width: '', height: '', left: '', top: '' };

self.once = function () {
  const element = self.$root.find('.flow-info').elm() as HTMLElement;
  const resizeHandle = self.$root.find('.resize-handle').elm() as HTMLElement;
  const minimizeBtn = self.$root.find('.minimize-btn').elm() as HTMLElement;
  const closeBtn = self.$root.find('.close-btn').elm() as HTMLElement;
  const helpIcon = self.$root.find('.help-icon').elm() as HTMLElement;
  const contentHeader = self.$root.find('.content-header').elm() as HTMLElement;
  const contentBody = self.$root.find('.content-body').elm() as HTMLElement;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Enforce maximum width at initialization
  const maxWidth = viewportWidth * 0.25;
  if (element.offsetWidth > maxWidth) {
    element.style.width = `${maxWidth}px`;
  }

  // Dragging logic
  element.addEventListener('mousedown', (e) => {
    if (isMinimized) {
      restoreElement();
      return;
    }
    if ((e.target as HTMLElement).closest('.resize-handle') || 
        (e.target as HTMLElement).closest('.minimize-btn') || 
        (e.target as HTMLElement).closest('.close-btn')) return;

    isDragging = true;
    offsetX = e.pageX - element.offsetLeft;
    offsetY = e.pageY - element.offsetTop;
    element.style.cursor = 'grabbing';

    const handleMousemove = (e: MouseEvent) => {
      if (!isDragging) return;

      let x = e.pageX - offsetX;
      let y = e.pageY - offsetY;

      x = Math.max(0, Math.min(x, viewportWidth - element.offsetWidth));
      y = Math.max(0, Math.min(y, viewportHeight - element.offsetHeight));

      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    };

    const handleMouseup = () => {
      isDragging = false;
      element.style.cursor = 'move';
      document.removeEventListener('mousemove', handleMousemove);
      document.removeEventListener('mouseup', handleMouseup);
    };

    document.addEventListener('mousemove', handleMousemove);
    document.addEventListener('mouseup', handleMouseup);
  });

  // Resizing logic
  resizeHandle.addEventListener('mousedown', (e) => {
    if (isMinimized) return;
    e.preventDefault();
    isResizing = true;
    initialWidth = element.offsetWidth;
    initialHeight = element.offsetHeight;
    initialX = e.pageX;
    initialY = e.pageY;

    const handleMousemove = (e: MouseEvent) => {
      if (!isResizing) return;

      let newWidth = initialWidth + (e.pageX - initialX);
      let newHeight = initialHeight + (e.pageY - initialY);

      // Enforce maximum width (1/4 of viewport width) and maximum height (80% of viewport height)
      newWidth = Math.min(newWidth, viewportWidth * 0.25);
      newHeight = Math.min(newHeight, viewportHeight * 0.8);

      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
    };

    const handleMouseup = () => {
      isResizing = false;
      document.removeEventListener('mousemove', handleMousemove);
      document.removeEventListener('mouseup', handleMouseup);
    };

    document.addEventListener('mousemove', handleMousemove);
    document.addEventListener('mouseup', handleMouseup);
  });

  // Minimize logic
  minimizeBtn.addEventListener('click', () => {
    if (isMinimized) {
      restoreElement();
    } else {
      // Save current state and minimize
      savedState = {
        width: element.style.width || `${element.offsetWidth}px`,
        height: element.style.height || `${element.offsetHeight}px`,
        left: element.style.left || `${element.offsetLeft}px`,
        top: element.style.top || `${element.offsetTop}px`,
      };
      element.style.width = '40px';
      element.style.height = '40px';
      element.style.left = '0px'; // Top-left corner
      element.style.top = '0px';
      element.classList.remove('min-w-[200px]', 'min-h-[100px]', 'w-[200px]', 'max-w-[25vw]', 'overflow-hidden', 'p-4', 'border', 'border-gray-200', 'rounded-lg', 'shadow-lg');
      element.classList.add('min-w-[40px]', 'min-h-[40px]', 'w-10', 'h-10', 'rounded-full', 'bg-gray-100', 'border-none', 'shadow-sm');
      contentHeader.classList.add('hidden');
      contentBody.classList.add('hidden');
      resizeHandle.classList.add('hidden');
      helpIcon.classList.remove('hidden');
      isMinimized = true;
    }
  });

  // Close logic
  closeBtn.addEventListener('click', () => {
    element.style.display = 'none';
  });

  // Restore function
  function restoreElement() {
    element.style.width = savedState.width;
    element.style.height = savedState.height;
    element.style.left = savedState.left;
    element.style.top = savedState.top;
    element.classList.remove('min-w-[40px]', 'min-h-[40px]', 'w-10', 'h-10', 'rounded-full', 'bg-gray-100', 'border-none', 'shadow-sm');
    element.classList.add('min-w-[200px]', 'min-h-[100px]', 'w-[200px]', 'max-w-[25vw]', 'overflow-hidden', 'p-4', 'border', 'border-gray-200', 'rounded-lg', 'shadow-lg');
    contentHeader.classList.remove('hidden');
    contentBody.classList.remove('hidden');
    resizeHandle.classList.remove('hidden');
    helpIcon.classList.add('hidden');
    isMinimized = false;
  }
};