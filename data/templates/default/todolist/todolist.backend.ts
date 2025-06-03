/* components/todolist/todolist.backend.ts */
import { Store } from "@yao/lib";
import { sui } from "@yao/sui";
import { Process } from "@yaoapps/client";


function getTodos(){
  return Process("models.todolist.get",{}) || [];
}

// Fetch all todos
function GetTodos(r: sui.Request) {
  return Process("models.todolist.get",{}) || [];
}

// Add a new todo
function ApiAddTodo(text: string) {
  const id = Process("models.todolist.create",{text})
  console.log('AddTodo:' + id)
  return  Process("models.todolist.find",id,{})
}

// Toggle todo completion
function ApiToggleTodo(id: string) {
  const item = Process("models.todolist.find",id,{})
  if (item) {
    item.completed = !item.completed;
    Process("models.todolist.save",item)
    return item;
  }
}

// Delete a todo
function ApiDeleteTodo(id:string) {
  console.log('DeleteTodo:' + id)
  const rs = Process("models.todolist.delete",id);
  console.log('result:' + rs)
  if (rs == null) {
    return true;
  }else{
    return false;
  }
}

// Initialize some sample todos
function BeforeRender(request: sui.Request, props: any) {
  
}