/* components/todolist/todolist.backend.ts */
import { Store } from "@yao/lib";
import { sui } from "@yao/sui";

let todos: Array<{ id: string; text: string; completed: boolean }> = undefined
let idCounter = 1;

function Init(){
  todos = new Store('cache').Get('todos') || [];
  idCounter = todos.length + 1;
}

function Save(){
  new Store('cache').Set('todos', todos);

}

function getTodos(){
  const cache = new Store('cache');

  console.log('todolist.backend.ts loaded');
  console.log('todos:',  cache.Get('todos'));
  return cache.Get('todos') || [];
}


// Simulated in-memory todo store (replace with database in production)
// let todos: Array<{ id: string; text: string; completed: boolean }> = cache.Get('todos') || [];

// Fetch all todos
function GetTodos(r: sui.Request) {
  Init()
  console.log('GetTodos',todos);
  return todos;
}

// Add a new todo
function ApiAddTodo(text: string) {
  Init()

  const newTodo = {
    id: (idCounter++).toString(),
    text,
    completed: false,
  };
  todos.push(newTodo);
  Save();
  return newTodo;
}

// Toggle todo completion
function ApiToggleTodo(id: string) {
  Init()
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    console.log('ApiToggleTodo todos',todos)
    Save();
    return todo;
  }
  return null;
}

// Delete a todo
function ApiDeleteTodo(id:string) {
  Init();
  console.log('ApiDeleteTodo',id);

  const index = todos.findIndex((t) => t.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    Save();
    return true;
  }
  return false;
}

// Initialize some sample todos
function BeforeRender(request: sui.Request, props: any) {
  Init();
  if (todos.length === 0) {
    todos = [
      { id: "1", text: "Learn SUI", completed: false },
      { id: "2", text: "Build TodoList", completed: true },
    ];
    idCounter = 3;
  }
  Save();
  return {
    todos,
  };
}