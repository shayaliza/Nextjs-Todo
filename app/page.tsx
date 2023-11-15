"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiEdit3 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

interface Task {
  text: string;
  completed: boolean;
}

export default function Home() {
  const [inputValue, setInputValue] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const inputEmpty = () => {
    if (inputValue.trim() === "") {
      alert("Enter the task");
      return false;
    }
    return true;
  };

  const createTask = () => {
    if (inputEmpty()) {
      const newTask: Task = { text: inputValue, completed: false };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      saveTasksToLocalStorage([...tasks, newTask]);
      setInputValue("");
    }
  };

  const deleteAllTasks = () => {
    setTasks([]);
    saveTasksToLocalStorage([]);
  };

  const deleteTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const editTask = (index: number) => {
    setInputValue(tasks[index].text);
    deleteTask(index);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const saveTasksToLocalStorage = (tasksToSave: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasksToSave));
  };

  const loadTasks = () => {
    const savedTasks =
      JSON.parse(localStorage.getItem("tasks") as string) || [];
    setTasks(savedTasks);
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTask();
    }
  };

  return (
    <div className="container">
      <div className="input-container">
        <div className="titles">
          <h1>To do list</h1>
          <p>Manage your task</p>
        </div>
        <div className="input-field">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type ur task"
            id="input-collect"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button id="submit-btn" onClick={createTask}>
            Add Task
          </button>
        </div>
      </div>

      <div className="tasks">
        {tasks.map((task, index) => (
          <div key={index} className="task-container">
            <input
              type="checkbox"
              id={`completed-task-${index}`}
              checked={task.completed}
              onChange={() => toggleTaskCompletion(index)}
            />
            <p className={task.completed ? "strike" : ""}>{task.text}</p>
            <FiEdit3
              className="bx bxs-edit hover:bg-blue-300"
              onClick={() => editTask(index)}
            />
            <MdDeleteOutline
              className="hover:bg-blue-300"
              onClick={() => deleteTask(index)}
            />
          </div>
        ))}
      </div>

      {tasks.length > 0 && (
        <button
          id="submit-btn"
          onClick={deleteAllTasks}
          className="mt-4 p-2  focus:outline-none focus:ring  rounded-lg"
        >
          Delete All Tasks
        </button>
      )}
    </div>
  );
}
