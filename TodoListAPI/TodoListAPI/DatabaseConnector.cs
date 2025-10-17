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

    public TodoItem AddTodo(string task, string listID)
    {
        string sql = "INSERT INTO todos (task, list_id) VALUES (@task, @listID); SELECT id, task, completed, list_id FROM todos WHERE id = LAST_INSERT_ID();";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@task", task);
            command.Parameters.AddWithValue("@listID", listID);
            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return new TodoItem
                    {
                        id = reader.GetInt32("id"),
                        task = reader.GetString("task"),
                        completed = reader.GetBoolean("completed"),
                        list_id = reader.GetInt32("list_id")
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
    public void ClearList(string listID)
    {
        string sql = "DELETE FROM todos WHERE list_id = @listID";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@listID", listID);
            int rowsAffected = command.ExecuteNonQuery();
        }
    }

    public List<TodoItem> GetTodoItems(string listID)
    {
        List<TodoItem> items = new List<TodoItem>();
        string sql = "SELECT id, task, completed FROM todos WHERE list_id = @listID";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@listID", listID);
            using MySqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                TodoItem item = new TodoItem
                {
                    id = reader.GetInt32("id"),
                    task = reader.GetString("task"),
                    completed = reader.GetBoolean("completed"),
                    list_id = int.Parse(listID)
                };
                items.Add(item);
            }
        };
        return items;
    }

    public TodoList CreateTodoList(string ownerID, string listName)
    {
        string sql = "INSERT INTO todolists (owner_id, name) VALUES (@ownerID, @listName); SELECT id, owner_id, name FROM todolists WHERE id = LAST_INSERT_ID();";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@ownerID", ownerID);
            command.Parameters.AddWithValue("@listName", listName);
            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return new TodoList
                    {
                        id = reader.GetInt32("id"),
                        owner_id = reader.GetInt32("owner_id"),
                        name = reader.GetString("name")
                    };
                }
                else
                {
                    throw new Exception("Failed to retrieve inserted todo list.");
                }
            }
        }
    }

// TODO: change so it doesn't take in Adapteruser
    public AdapterUser CreateUser(AdapterUser adapterUser)
    {
        string sql = "INSERT INTO users (username, email, email_verified) VALUES (@username, @email, @email_verified); SELECT id, username, email, email_verified FROM users WHERE id = LAST_INSERT_ID();";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@username", adapterUser.name);
            command.Parameters.AddWithValue("@email", adapterUser.email);
            command.Parameters.AddWithValue("@email_verified", adapterUser.emailVerified);
            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return new AdapterUser
                    {
                        email = reader.GetString("email"),
                        emailVerified = reader.GetDateTime("email_verified"),
                        id = (reader.GetInt32("id")).ToString(),
                        name = reader.GetString("username")
                    };
                }
                else
                {
                    throw new Exception("Failed to retrieve user.");
                }
            }
        }
    }

    public void DeleteUser(string userID)
    {
        string sql = "DELETE FROM users WHERE id = @userID";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@userID", userID);
            int rowsAffected = command.ExecuteNonQuery();
        }
    }

    public void DeleteTodoList(string listID)
    {
        string sql = "DELETE FROM todolists WHERE id = @listID";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@listID", listID);
            int rowsAffected = command.ExecuteNonQuery();
        }
    }

    public List<TodoList> GetTodoLists(string ownerID)
    {
        List<TodoList> lists = new List<TodoList>();
        string sql = "SELECT id, name FROM todolists WHERE owner_id = @ownerID";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@ownerID", ownerID);
            using MySqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                TodoList list = new TodoList
                {
                    id = reader.GetInt32("id"),
                    name = reader.GetString("name"),
                    owner_id = int.Parse(ownerID)
                };
                lists.Add(list);
            }
        };
        return lists;
    }
    public void ShareTodoList(ShareJson shareJson)
    {
        string sql = "INSERT INTO todolist_shares (todolist_id, user_id) VALUES (@listID, @userID)";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@listID", shareJson.listID);
            command.Parameters.AddWithValue("@userID", GetUserID(shareJson.username));
            int rowsAffected = command.ExecuteNonQuery();
        }
    }

    private string GetUserID(string username)
    {
        string sql = "SELECT id FROM users WHERE username = @username";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@username", username);
            var result = command.ExecuteScalar();
            if (result != null)
            {
                return result.ToString();
            }
            else
            {
                throw new Exception("User not found.");
            }
        }
    }

    public AdapterUser GetUser(string id)
    {
        string sql = "SELECT id, username, email, email_verified FROM users WHERE id = @id";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@id", id);
            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return new AdapterUser
                    {
                        id = reader.GetInt32("id").ToString(),
                        name = reader.GetString("username"),
                        email = reader.GetString("email"),
                        emailVerified = reader.GetDateTime("email_verified")
                    };
                }
                else
                {
                    throw new Exception("User not found.");
                }
            }
        }
        
    }

    public AdapterUser GetUserByAccount(AccountIDs accountIDs)
    {
        string sql = "SELECT u.id, u.username, u.email, u.email_verified FROM users u JOIN accounts a ON u.id = a.user_id WHERE a.provider = @provider AND a.providerAccountId = @providerAccountId";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@provider", accountIDs.provider);
            command.Parameters.AddWithValue("@providerAccountId", accountIDs.providerAccountId);
            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return new AdapterUser
                    {
                        id = reader.GetInt32("id").ToString(),
                        name = reader.GetString("username"),
                        email = reader.GetString("email"),
                        emailVerified = reader.GetDateTime("email_verified")
                    };
                }
                else
                {
                    throw new Exception("User not found.");
                }
            }
        }
    }

    public Boolean UserHasAccount(string providerID, string provider)
    {
        string sql = "SELECT COUNT(*) FROM accounts WHERE providerAccountId = @providerID AND provider = @provider";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@providerID", providerID);
            command.Parameters.AddWithValue("@provider", provider);
            int count = Convert.ToInt32(command.ExecuteScalar());
            return count > 0;
        }
    }

    public Boolean UserExistsByEmail(string email)
    {
        string sql = "SELECT COUNT(*) FROM users WHERE email = @email";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@email", email);
            int count = Convert.ToInt32(command.ExecuteScalar());
            return count > 0;
        }
    }

    public AdapterUser GetUserByEmail(string email)
    {
        string sql = "SELECT id, username, email, email_verified FROM users WHERE email = @email";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@email", email);
            using (var reader = command.ExecuteReader())
            {
                if (reader.Read())
                {
                    return new AdapterUser
                    {
                        id = reader.GetInt32("id").ToString(),
                        name = reader.GetString("username"),
                        email = reader.GetString("email"),
                        emailVerified = reader.GetDateTime("email_verified")
                    };
                }
                else
                {
                    throw new Exception("User not found.");
                }
            }
        }
    }
    
    public void LinkAccount(AdapterAccount adapterAccount)
    {
        string sql = "INSERT INTO accounts (provider, providerAccountId, type, user_id) VALUES (@provider, @providerAccountId, @type, @user_id)";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@provider", adapterAccount.provider);
            command.Parameters.AddWithValue("@providerAccountId", adapterAccount.providerAccountId);
            command.Parameters.AddWithValue("@type", adapterAccount.type);
            command.Parameters.AddWithValue("@user_id", adapterAccount.user_id);
            int rowsAffected = command.ExecuteNonQuery();
        }
    }

    public List<TodoList> GetSharedTodoLists(string userID)
    {
        List<TodoList> lists = new List<TodoList>();
        string sql = "SELECT tl.id, tl.name, tl.owner_id FROM todolists tl JOIN todolist_shares tls ON tl.id = tls.todolist_id WHERE tls.user_id = @userID";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@userID", userID);
            using MySqlDataReader reader = command.ExecuteReader();
            while (reader.Read())
            {
                TodoList list = new TodoList
                {
                    id = reader.GetInt32("id"),
                    name = reader.GetString("name"),
                    //TODO change so it returns a username instead of user id
                    owner_id = reader.GetInt32("owner_id")
                };
                lists.Add(list);
            }
        };
        return lists;
    }

    public void UnshareTodoList(ShareJson shareJson)
    {
        string sql = "DELETE FROM todolist_shares WHERE todolist_id = @listID AND user_id = @userID";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@listID", shareJson.listID);
            command.Parameters.AddWithValue("@userID", GetUserID(shareJson.username));
            int rowsAffected = command.ExecuteNonQuery();
        }
    }

    public bool UserExists(string username)
    {
        string sql = "SELECT COUNT(*) FROM users WHERE username = @username";
        using (var command = new MySqlCommand(sql, connection))
        {
            command.Parameters.AddWithValue("@username", username);
            int count = Convert.ToInt32(command.ExecuteScalar());
            return count > 0;
        }
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
