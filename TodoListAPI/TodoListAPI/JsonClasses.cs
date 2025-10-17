using System;
using System.Collections.Generic;

class TaskJson
{
    public string task { get; set; }
    public string listID { get; set; }
}

class CompletionJson
{
    public Boolean Completion { get; set; }
}

class TodoListJson
{
    public string name { get; set; }
    public string ownerID { get; set; }
}

class UserJson
{
    public string username { get; set; }
    public string password { get; set; }
    public string email { get; set; }
}

public class TodoItem
{
    public int id { get; set; }
    public string task { get; set; }
    public bool completed { get; set; }
    public int list_id { get; set; }
}

public class TodoList
{
    public string name { get; set; }
    public int id { get; set; }
    public int owner_id { get; set; }
}

public class TodoWithError
{
    public TodoItem data { get; set; }
    public string error { get; set; }
}

public class TodoListWithError
{
    public TodoList data { get; set; }
    public string error { get; set; }
}

public class TodoItems
{
    public List<TodoItem> data { get; set; }
    public string error { get; set; }
}

public class TodoLists
{
    public List<TodoList> data { get; set; }
    public string error { get; set; }
}

public class ShareJson
{
    public string listID { get; set; }
    public string username { get; set; }
}

public class AdapterUser
{
    public string email { get; set; }
    public DateTime emailVerified { get; set; }
    public string id { get; set; }
    public string name { get; set; }
}

public class AdapterAccount
{
    public string provider { get; set; }
    public string providerAccountId { get; set; }
    public string type { get; set; }
    public string user_id { get; set; }
}

public class AccountIDs
{
    public string provider { get; set; }
    public string providerAccountId { get; set; }
}

public class UserLogIn
{
    public string id { get; set; }
    public string name { get; set; }
    public string email { get; set; }
    public string type { get; set; }
    public string provider { get; set; }
}