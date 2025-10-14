

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

var databaseConn = new DatabaseConnector();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapPost("/AddTodo", (TaskJson taskJson) =>
{
    var todo = new TodoWithError();
    try
    {
        todo.data = databaseConn.AddTodo(taskJson.task, taskJson.listID);
        todo.error = "";
    }
    catch (Exception ex)
    {
        todo.data = null;
        todo.error = ex.Message;
    }
    return todo;
})
.WithName("AddTodo");

app.MapDelete("/DeleteTodo", (string todoID) =>
{
    databaseConn.DeleteTodo(todoID);
})
.WithName("DeleteTodo");

app.MapPut("/ChangeCompletion", (string todoID, CompletionJson completion) =>
{
    databaseConn.ChangeTodoCompletion(todoID, completion.Completion);
})
.WithName("ChangeCompletion");

app.MapDelete("/ClearTodo", (string listID) =>
{
    databaseConn.ClearList(listID);
})
.WithName("ClearTodoList");

app.MapGet("/GetTodoListItems", (string listID) =>
{
    var todoItems = new TodoItems();
    try
    {
        todoItems.data = databaseConn.GetTodoItems(listID);
        todoItems.error = "";
    }
    catch (Exception ex)
    {
        todoItems.data = new List<TodoItem>();
        todoItems.error = ex.Message;
    }
    return todoItems;
})
.WithName("GetTodoListItems");

app.MapGet("/GetTodoLists", (string ownerID) =>
{
    var todoLists = new TodoLists();
    try
    {
        todoLists.data = databaseConn.GetTodoLists(ownerID);
        todoLists.error = "";
    }
    catch (Exception ex)
    {
        todoLists.data = new List<TodoList>();
        todoLists.error = ex.Message;
    }
    return todoLists;
})
.WithName("GetTodoLists");

app.MapPost("/CreateTodoList", (TodoListJson todoListJson) =>
{
    var todoList = new TodoListWithError();
    try
    {
        todoList.data = databaseConn.CreateTodoList(todoListJson.ownerID, todoListJson.name);
        todoList.error = "";
    }
    catch (Exception ex)
    {
        todoList.data = null;
        todoList.error = ex.Message;
    }
    return todoList;
})
.WithName("CreateTodoList");

app.MapPost("/User", (UserJson userJson) =>
{
    //TODO hash password somewhere
    databaseConn.CreateUser(userJson.username, userJson.password, userJson.email);
})
.WithName("User");

app.MapDelete("/DeleteUser", (string userID) =>
{
    databaseConn.DeleteUser(userID);
}).WithName("DeleteUser");

app.MapGet("/UserExist", (string username) =>
{
    return databaseConn.UserExists(username);
}).WithName("UserExist");

app.MapDelete("/DeleteTodoList", (string listID) =>
{
    databaseConn.DeleteTodoList(listID);
}).WithName("DeleteTodoList");

app.MapPost("/ShareTodoList", (ShareJson shareJson) =>
{
    databaseConn.ShareTodoList(shareJson);
}).WithName("ShareTodoList");

app.MapPost("/UnshareTodoList", (ShareJson shareJson) =>
{
    databaseConn.UnshareTodoList(shareJson);
}).WithName("UnshareTodoList");

app.MapGet("/GetSharedTodoLists", (string userID) =>
{
    var todoLists = new TodoLists();
    try
    {
        todoLists.data = databaseConn.GetSharedTodoLists(userID);
        todoLists.error = "";
    }
    catch (Exception ex)
    {
        todoLists.data = new List<TodoList>();
        todoLists.error = ex.Message;
    }
    return todoLists;
}).WithName("GetSharedTodoLists");

app.Run();