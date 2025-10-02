using MySql.Data.MySqlClient;
public class DatabaseConnector
{
    private MySqlConnection connection;

    public DatabaseConnector()
    {
        connection = ConnectToDatabase();
    }

    private MySqlConnection ConnectToDatabase()
    {
        string server = Environment.GetEnvironmentVariable("MYSQL_HOST") ?? "";
        string port = Environment.GetEnvironmentVariable("MYSQL_PORT") ?? "";
        string database = Environment.GetEnvironmentVariable("MYSQL_DATABASE") ?? "";
        string user = Environment.GetEnvironmentVariable("MYSQL_USER") ?? "";
        string password = Environment.GetEnvironmentVariable("MYSQL_ROOT_PASSWORD") ?? "";
        if (string.IsNullOrEmpty(server) || string.IsNullOrEmpty(port) || string.IsNullOrEmpty(database) || string.IsNullOrEmpty(user) || string.IsNullOrEmpty(password))
        {
            Console.WriteLine("One or more required environment variables are missing.");
            return null;
        }

        string connectionString = $"Server={server};Port={port};Database={database};Uid={user};Pwd={password};";
        MySqlConnection conn = new MySqlConnection(connectionString);
        try
        {
            conn.Open();
            Console.WriteLine("Successfully connected to the database.");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error connecting to the database: " + ex.Message);
            Environment.Exit(1);
        }
        return conn;
    }

    public TodoItem AddTodo(string task)
    {
        string sql = "INSERT INTO todos (task) VALUES (@task); SELECT id, task, completed FROM todos WHERE id = LAST_INSERT_ID();";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@task", task);
            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return new TodoItem
                    {
                        id = reader.GetInt32("id"),
                        task = reader.GetString("task"),
                        completed = reader.GetBoolean("completed")
                    };
                }
                else
                {
                    throw new Exception("Failed to retrieve inserted todo item.");
                }
            }
        }
    }

    public void DeleteTodo(string todoID)
    {
        string sql = "DELETE FROM todos WHERE id = @todoID";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@todoID", todoID);
            int rowsAffected = command.ExecuteNonQuery();
        }
    }

    public void ChangeTodoCompletion(string todoID, Boolean completion)
    {
        string sql = "UPDATE todos SET completed = @completion WHERE id = @todoID";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@todoID", todoID);
            command.Parameters.AddWithValue("@completion", completion);
            int rowsAffected = command.ExecuteNonQuery();
        }
    }
    public void ClearList()
    {
        string sql = "DELETE FROM todos";
        using (var command = new MySqlCommand(sql, connection))
        {
            int rowsAffected = command.ExecuteNonQuery();
        }
    }

    public List<TodoItem> GetTodoItems()
    {
        List<TodoItem> items = new List<TodoItem>();
        string sql = "SELECT id, task, completed FROM todos";
        using var command = new MySqlCommand(sql, connection);
        using MySqlDataReader reader = command.ExecuteReader();
        while (reader.Read())
        {
            TodoItem item = new TodoItem
            {
                id = reader.GetInt32("id"),
                task = reader.GetString("task"),
                completed = reader.GetBoolean("completed")
            };
            items.Add(item);
        }

        return items;
    }

    public void Dispose()
    {
        if (connection != null)
        {
            connection.Close();
            connection.Dispose();
        }
    }

}
