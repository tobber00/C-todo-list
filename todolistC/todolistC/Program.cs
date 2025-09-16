using System;
using System.Data;

using MySql.Data;
using MySql.Data.MySqlClient;

class MainClass
{
    static void Main(string[] args)
    {
        bool running = true;
        App program = new App();
        while (running)
        {
            Console.WriteLine("To-Do List Application");
            Console.WriteLine("1. Add task");
            Console.WriteLine("2. Remove task");
            Console.WriteLine("3. Display list");
            Console.WriteLine("4. Complete task");
            Console.WriteLine("5. Clear list");
            Console.WriteLine("6. Exit");
            Console.Write("Choose an option: ");
            string choice = Console.ReadLine();

            switch (choice)
            {
                case "1":
                    Console.Write("Enter task: ");
                    program.Addtask(Console.ReadLine());
                    break;
                case "2":
                    Console.Write("Enter task ID to remove: ");
                    program.Removetask(Console.ReadLine());
                    break;
                case "3":
                    program.DisplayList();
                    break;
                case "4":
                    Console.Write("Enter task ID to complete: ");
                    program.Completetask(Console.ReadLine());
                    break;
                case "5":
                    program.ClearList();
                    break;
                case "6":
                    program.Close();
                    running = false;
                    break;
                default:
                    Console.WriteLine("Invalid option. Please try again.");
                    break;
            }
            Console.WriteLine();
        }
    }
}

class App
{
    private MySqlConnection db;

    public App()
    {
        db = ConnectToDatabase();
    }

    private MySqlConnection ConnectToDatabase()
    {
        string connectionString = "Server=127.0.0.1;Port=3306;Database=todo;Uid=root;Pwd=password;";
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

    public void Addtask(string task)
    {
        string sql = "INSERT INTO tasks (task) VALUES (@task);";
        using (var command = new MySqlCommand(sql, db))
        {
            command.Parameters.AddWithValue("@task", task);
            int rowsAffected = command.ExecuteNonQuery();
            Console.WriteLine($"Inserted {rowsAffected} row(s).");
        }
    }

    public void Removetask(string taskID)
    {
        string sql = "DELETE FROM tasks WHERE id = @taskID";
        using (var command = new MySqlCommand(sql, db))
        {
            command.Parameters.AddWithValue("@taskID", taskID);
            int rowsAffected = command.ExecuteNonQuery();
            Console.WriteLine($"Deleted {rowsAffected} row(s).");
        }
    }

    public void DisplayList()
    {
        string sql = "SELECT id, task, completed FROM tasks";
        using var command = new MySqlCommand(sql, db);
        using MySqlDataReader reader = command.ExecuteReader();
        Console.WriteLine("To-Do List:");
        while (reader.Read())
        {
            int id = reader.GetInt32("id");
            string task = reader.GetString("task");
            bool completed = reader.GetBoolean("completed");
            string status = completed ? "[X]" : "[ ]";
            Console.WriteLine($"{id}. {status} {task}");
        }
    }

    public void Completetask(string taskID)
    {
        string sql = "UPDATE tasks SET completed = true WHERE id = @taskID";
        using (var command = new MySqlCommand(sql, db))
        {
            command.Parameters.AddWithValue("@taskID", taskID);
            int rowsAffected = command.ExecuteNonQuery();
            Console.WriteLine($"Updated {rowsAffected} row(s).");
        }
    }

    public void ClearList()
    {
        var sql = "DELETE FROM tasks";
        using (var command = new MySqlCommand(sql, db))
        {
            int rowsAffected = command.ExecuteNonQuery();
            Console.WriteLine($"Cleared {rowsAffected} row(s).");
        }
    }

    public void Close()
    {
        db.Close();
    }
}
