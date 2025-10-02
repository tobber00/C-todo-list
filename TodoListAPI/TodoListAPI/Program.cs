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
        todo.data = databaseConn.AddTodo(taskJson.task);
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

app.MapDelete("/ClearTodo", () =>
{
    databaseConn.ClearList();
})
.WithName("ClearTodoList");

app.MapGet("/GetTodoList", () =>
{
    var todoList = new TodoList();
    try
    {
        todoList.data = databaseConn.GetTodoItems();
        todoList.error = "";
    }
    catch (Exception ex)
    {
        todoList.data = new List<TodoItem>();
        todoList.error = ex.Message;
    }
    return todoList;
})
.WithName("GetTodoList");

app.Run();