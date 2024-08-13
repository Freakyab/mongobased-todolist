"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCircle, FaRegCheckCircle, FaMoon } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { IoSunnyOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { addTodo, getTodos, updateTodo, deleteTodo } from "../action/todo";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Todo = {
  id: string;
  message: string;
  title: string;
  done: boolean;
};

const TodoList = () => {
  const [newTodoText, setNewTodoText] = useState({
    title: "",
    message: "",
    done: false,
  }); // State for storing new todo text
  const [darkMode, setDarkMode] = useState(true); // State for toggling dark mode
  const [todos, setTodos] = useState<Todo[]>([]); // State for storing todos
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      const { data, error } = await getTodos();
      if (error) {
        console.error(error);
      } else {
        if (data) {
          setTodos(data);
        }
      }
      setLoading(false);
    };
    fetchTodos();
  }, [editMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editMode) {
      const { data, error } = await updateTodo(id, {
        title: newTodoText.title,
        message: newTodoText.message,
        done: newTodoText.done,
      });
      if (error) {
        toast.error("Error updating todo");
        return;
      }
      if (data) {
        toast.success("Todo updated successfully");
      }
      setEditMode(false);
      setId("");
      setNewTodoText({ title: "", message: "", done: false });
      return;
    }
    if (newTodoText.message.trim() === "" || newTodoText.title.trim() === "") {
      toast.error("Title and message cannot be empty");
      return;
    }
    const { data, error } = await addTodo({
      title: newTodoText.title,
      message: newTodoText.message,
      done: newTodoText.done,
    });

    if (error) {
      toast.error("Error adding todo");
      console.error(error);
    }

    if (data) {
      toast.success("Todo added successfully");
      setTodos([...todos, data]);
    }

    setNewTodoText({ title: "", message: "", done: false });
  };

  const handleCompleteTodo = async (id: string, todo: Todo) => {
    const { data, error } = await updateTodo(id, {
      title: todo.title,
      message: todo.message,
      done: !todo.done,
    });
    if (error) {
      toast.error("Error updating todo");
      return;
    }

    if (data) {
      const updatedTodos = todos.map((t) => {
        if (t.id === id) {
          return data;
        }
        return t;
      });
      setTodos(updatedTodos);
      toast.success("Todo updated successfully");
    }
  };

  const handleEditTodo = async (id: string) => {
    setEditMode(true);
    setId(id);
    setNewTodoText(todos.find((todo) => todo.id === id) as Todo);
  };

  const handleRemoveTodo = async (id: string) => {
    const { data, error } = await deleteTodo(id);
    if (error) {
      toast.error("Error deleting todo");
      console.error(error);
      return;
    }

    if (data) {
      toast.success("Todo deleted successfully");
      const updatedTodos = todos.filter((t) => t.id !== id);
      setTodos(updatedTodos);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-start md:justify-center items-center ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-pink-500 to-rose-500 text-gray-800"
      } transition-colors duration-300`}>
      {/* Header with title and dark mode toggle button */}
      <div className="flex items-center justify-center mt-10 gap-3">
        <h1 className="text-4xl font-bold uppercase">Todo List</h1>
        <motion.button
          onClick={toggleDarkMode}
          animate={{ rotate: darkMode ? 180 : 0 }}>
          {darkMode ? (
            <IoSunnyOutline className="text-2xl text-yellow-500" />
          ) : (
            <FaMoon className="text-2xl text-gray-950" />
          )}
        </motion.button>
      </div>
      {/* Todo input and list */}
      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 mt-8 p-3">
        {/* Form for adding new todo */}
        <div
          className={`rounded-md shadow-lg p-4 mt-8 ${
            darkMode ? "bg-gray-800" : "bg-white"
          } w-full transition-colors duration-300`}>
          <form
            onSubmit={handleSubmit}
            className="flex items-center flex-row-reverse">
            <div className="flex flex-col w-full">
              <input
                type="text"
                placeholder="Add todo title..."
                value={newTodoText.title}
                onChange={(e) =>
                  setNewTodoText({ ...newTodoText, title: e.target.value })
                }
                className={`px-4 py-2 m-2 outline-none border rounded-md flex-grow ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                } transition-colors duration-300 text-sm`}
              />
              <textarea
                // type="text"
                placeholder="Add todo message..."
                value={newTodoText.message}
                onChange={(e) =>
                  setNewTodoText({ ...newTodoText, message: e.target.value })
                }
                className={`px-4 py-2 m-2 outline-none border rounded-md text-sm flex-grow ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-800"
                } transition-colors duration-300`}
              />
              {editMode ? (
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`bg-red-500 text-white px-4 py-2 rounded-md mt-2 transition-colors duration-300`}>
                  Update Todo
                </motion.button>
              ) : (
                <button
                  type="submit"
                  className={`bg-blue-500 text-white px-4 py-2 rounded-md mt-2 transition-colors duration-300`}>
                  Add Todo
                </button>
              )}
            </div>
          </form>
        </div>
        {/* Todo list */}
        <div className="mt-8 w-full">
          {/* Mapping through todos and rendering them */}
          {!loading ? (
            todos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.2 },
                }}
                className={`flex items-center justify-between gap-3 rounded-md shadow-lg hover:shadow-2xl p-4 mb-4 ${
                  todo.done ? "line-through text-gray-500" : "text-gray-800"
                } ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } transition-all duration-300`}>
                {/* Button to toggle todo completion */}
                <button onClick={() => handleCompleteTodo(todo.id, todo)}>
                  {todo.done ? (
                    <FaRegCheckCircle className="text-green-500 text-2xl" />
                  ) : (
                    <FaCircle
                      className={`
                  text-xl ${darkMode ? "text-blue-300" : "text-pink-500"}
                    `}
                    />
                  )}
                </button>
                {/* Text of the todo */}
                <div className="flex flex-col w-full">
                  <p
                    className={`text-lg capitalize font-semibold underline
                ${darkMode ? "text-blue-300" : "text-pink-500"}
                  `}>
                    {todo.title}
                  </p>
                  <p
                    className={`px-2
                ${darkMode ? "text-gray-300" : "text-gray-800"}
                  `}>
                    {todo.message}
                  </p>
                </div>
                {/* Buttons for editing and removing todo */}
                <div className="flex flex-col items-center gap-2">
                  <motion.button
                    onClick={() => handleEditTodo(todo.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="border-2 border-blue-500 rounded-md p-1">
                    <RiEdit2Line className="text-blue-500 text-lg" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleRemoveTodo(todo.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="border-2 border-red-500 rounded-md p-1">
                    <MdDelete className="text-red-500 text-lg" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-4 rounded-md`}>
              <p
                className={`text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-800"
                }`}>
                Loading todos
                <span
                  className={`animate-spin duration-100 inline-block ml-2 text-lg ${
                    darkMode ? "text-blue-300" : "text-pink-500"
                  }`}>
                  ⏳
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default TodoList;
