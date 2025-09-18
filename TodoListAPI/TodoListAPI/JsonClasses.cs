using System;
using System.Collections.Generic;

class TaskJson
{
    public string task { get; set; }
}

class CompletionJson
{
    public Boolean Completion { get; set; }
}

public class TodoItem
{
    public int id { get; set; }
    public string task { get; set; }
    public bool completed { get; set; }
}

public class TodoList
{
    public List<TodoItem> data { get; set; }
    public string error { get; set; }
}