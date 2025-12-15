import React, { useState, useEffect } from 'react';
import { TodoItem } from '../types';
import { Icons } from './Icon';

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('dashboard_tasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: TodoItem = {
      id: Date.now().toString(),
      text: input,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="bg-glass border border-glassBorder rounded-3xl p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Icons.CheckCircle className="w-5 h-5 text-green-400" /> To-Do
      </h3>
      
      <div className="flex gap-2 mb-4">
        <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Nieuwe taak..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-rijnlandLight transition-colors"
        />
        <button 
            onClick={addTask}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
        >
            <Icons.Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {tasks.length === 0 && (
            <div className="text-center text-gray-500 text-sm mt-8">Je hebt alles gedaan! 🎉</div>
        )}
        {tasks.map(task => (
            <div key={task.id} className="group flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-transparent hover:border-white/10 transition-all">
                <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-500 hover:border-white'}`}
                >
                    {task.completed && <Icons.CheckCircle className="w-3.5 h-3.5 text-white" />}
                </button>
                <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                    {task.text}
                </span>
                <button 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"
                >
                    <Icons.Trash className="w-4 h-4" />
                </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
