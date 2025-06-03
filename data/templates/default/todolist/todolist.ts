/* components/todolist/todolist.ts */
import { Component, EventData, EventDetail, $Backend, __sui_data } from "@yao/sui";

const self = this as Component;

// Initialize component state
self.once = async function () {
};

// Add a new todo
self.addTodo = async (event: Event, data: EventData, detail: EventDetail) => {
  const input = self.$root.find("#todo-input").elm() as HTMLInputElement;
  const text = input.value.trim();
  if (!text) return;
  // Call backend to add todo
  try {
    const newTodo = await $Backend("/todolist").Call("AddTodo", text);
    if (newTodo) {
      const todos = self.store.GetJSON("todos") || [];
      todos.push(newTodo);
      self.store.SetJSON("todos", todos);
      await self.render("todo-list", { todos });
      input.value = ""; // Clear input
    }
  } catch (error) {
    alert(error.message);
  }
};

// Toggle todo completion status
self.toggleTodo = async (event: Event, data: EventData, detail: EventDetail) => {
  const id = parseInt(data["id"]);
  const todos = self.store.GetJSON("todos") || [];
  const todo = todos.find((t: any) => t.id === id);
  if (todo) {
    try {
      const updatedTodo = await $Backend("/todolist").Call("ToggleTodo", id);
      if (updatedTodo) {
        todo.completed = updatedTodo.completed;
        self.store.SetJSON("todos", todos);
        await self.render("todo-list", { todos });
      }
    } catch (error) {
      alert(error.message);
    }
  }
};

// Delete a todo
self.deleteTodo = async (event: Event, data: EventData, detail: EventDetail) => {
  const id = parseInt(data["id"]);
  try {
    const success = await $Backend("/todolist").Call("DeleteTodo", id);
    if (success) {
      const todos = (self.store.GetJSON("todos") || []).filter((t: any) => t.id !== id);
      self.store.SetJSON("todos", todos);
      await self.render("todo-list", { todos });
    }
  } catch (error) {
    alert(error.message);
  }
};
function initState() {
  // self.store.SetJSON('todos', __sui_data['todos']);
}
document.addEventListener("DOMContentLoaded", initState);
