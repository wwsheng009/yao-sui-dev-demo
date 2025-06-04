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

  if (self.store.GetJSON('page_info') != null) {
    element.classList.remove('hidden');
  }
  // Enforce maximum width at initialization
  const maxWidth = viewportWidth * 0.5;
  if (element.offsetWidth > maxWidth) {
    element.style.width = `${maxWidth}px`;
  }

  // Unified move handler for dragging and resizing
  const handleMove = (x: number, y: number) => {
    if (isDragging) {
      let newX = x - offsetX;
      let newY = y - offsetY;
      newX = Math.max(0, Math.min(newX, viewportWidth - element.offsetWidth));
      newY = Math.max(0, Math.min(newY, viewportHeight - element.offsetHeight));
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
    } else if (isResizing) {
      let newWidth = initialWidth + (x - initialX);
      let newHeight = initialHeight + (y - initialY);
      newWidth = Math.min(newWidth, viewportWidth * 0.5);
      newHeight = Math.min(newHeight, viewportHeight * 0.8);
      element.style.width = `${newWidth}px`;
      element.style.height = `${newHeight}px`;
    }
  };

  // Unified end handler for cleanup
  const handleEnd = () => {
    isDragging = false;
    isResizing = false;
    element.style.cursor = 'move';
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', handleEnd);
    document.removeEventListener('touchmove', touchMoveHandler);
    document.removeEventListener('touchend', handleEnd);
  };

  // Mouse move handler
  const mouseMoveHandler = (e: MouseEvent) => {
    handleMove(e.pageX, e.pageY);
  };

  // Touch move handler
  const touchMoveHandler = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      handleMove(e.touches[0].pageX, e.touches[0].pageY);
    }
  };

  // Dragging logic (Mouse)
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

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', handleEnd);
  });

  // Dragging logic (Touch)
  element.addEventListener('touchstart', (e) => {
    if (isMinimized) {
      restoreElement();
      return;
    }
    if ((e.target as HTMLElement).closest('.resize-handle') || 
        (e.target as HTMLElement).closest('.minimize-btn') || 
        (e.target as HTMLElement).closest('.close-btn')) return;

    e.preventDefault();
    isDragging = true;
    const touch = e.touches[0];
    offsetX = touch.pageX - element.offsetLeft;
    offsetY = touch.pageY - element.offsetTop;
    element.style.cursor = 'grabbing';

    document.addEventListener('touchmove', touchMoveHandler);
    document.addEventListener('touchend', handleEnd);
  });

  // Resizing logic (Mouse)
  resizeHandle.addEventListener('mousedown', (e) => {
    if (isMinimized) return;
    e.preventDefault();
    isResizing = true;
    initialWidth = element.offsetWidth;
    initialHeight = element.offsetHeight;
    initialX = e.pageX;
    initialY = e.pageY;

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', handleEnd);
  });

  // Resizing logic (Touch)
  resizeHandle.addEventListener('touchstart', (e) => {
    if (isMinimized) return;
    e.preventDefault();
    isResizing = true;
    initialWidth = element.offsetWidth;
    initialHeight = element.offsetHeight;
    const touch = e.touches[0];
    initialX = touch.pageX;
    initialY = touch.pageY;

    document.addEventListener('touchmove', touchMoveHandler);
    document.addEventListener('touchend', handleEnd);
  });

  // Minimize logic
  minimizeBtn.addEventListener('click', () => {
    if (isMinimized) {
      restoreElement();
    } else {
      savedState = {
        width: element.style.width || `${element.offsetWidth}px`,
        height: element.style.height || `${element.offsetHeight}px`,
        left: element.style.left || `${element.offsetLeft}px`,
        top: element.style.top || `${element.offsetTop}px`,
      };
      element.style.width = '40px';
      element.style.height = '40px';
      element.style.left = '0px';
      element.style.top = '0px';
      element.classList.remove('min-w-[200px]', 'min-h-[100px]', 'w-[200px]', 'max-w-[50vw]', 'overflow-hidden', 'p-4', 'border', 'border-gray-200', 'rounded-lg', 'shadow-lg');
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
    element.classList.add('min-w-[200px]', 'min-h-[100px]', 'w-[200px]', 'max-w-[50vw]', 'overflow-hidden', 'p-4', 'border', 'border-gray-200', 'rounded-lg', 'shadow-lg');
    contentHeader.classList.remove('hidden');
    contentBody.classList.remove('hidden');
    resizeHandle.classList.remove('hidden');
    helpIcon.classList.add('hidden');
    isMinimized = false;
  }
};