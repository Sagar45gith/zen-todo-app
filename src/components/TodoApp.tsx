import React, { useState, useEffect } from 'react';
import { Plus, Check, X } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('zen-todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        })));
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('zen-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    
    setIsAddingTodo(true);
    
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date()
    };

    setTimeout(() => {
      setTodos(prev => [newTodo, ...prev]);
      setInputValue('');
      setIsAddingTodo(false);
    }, 200);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-gray-50 to-stone-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-stone-700 mb-4 tracking-wide">
            Zen Focus
          </h1>
          <p className="text-stone-500 text-lg font-light">
            Find clarity in your daily tasks
          </p>
          <div className="w-16 h-0.5 bg-emerald-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Stats Section */}
        {totalCount > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-sm border border-stone-200/50">
            <div className="flex justify-between items-center text-stone-600">
              <span className="font-medium">Progress</span>
              <span className="text-sm">
                {completedCount} of {totalCount} completed
              </span>
            </div>
            <div className="mt-3 bg-stone-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-sm border border-stone-200/50">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What needs your focus today?"
                className="w-full px-6 py-4 bg-stone-50/80 border border-stone-200/80 rounded-xl text-stone-700 placeholder-stone-400 focus:outline-none focus:border-emerald-400 focus:bg-white/90 transition-all duration-200 font-light text-lg"
                disabled={isAddingTodo}
              />
            </div>
            <button
              onClick={addTodo}
              disabled={isAddingTodo || inputValue.trim() === ''}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-xl font-medium transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isAddingTodo ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Plus size={20} />
              )}
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
                <Check size={32} className="text-stone-400" />
              </div>
              <p className="text-stone-500 text-lg font-light">
                Your mind is clear and focused
              </p>
              <p className="text-stone-400 mt-2">
                Add a task above to begin your journey
              </p>
            </div>
          ) : (
            todos.map((todo, index) => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                onToggle={toggleTodo} 
                onDelete={deleteTodo}
                delay={index * 50}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-stone-400 text-sm">
          <p>Breathe deeply, focus intentionally</p>
        </div>
      </div>
    </div>
  );
}

// Individual Todo Item Component
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  delay: number;
}

function TodoItem({ todo, onToggle, onDelete, delay }: TodoItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(todo.id), 200);
  };

  return (
    <div 
      className={`transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${isDeleting ? 'translate-x-full opacity-0' : ''}`}
    >
      <div className={`bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-stone-200/50 hover:shadow-md hover:bg-white/80 transition-all duration-200 ${
        todo.completed ? 'bg-stone-50/70' : ''
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggle(todo.id)}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              todo.completed 
                ? 'bg-emerald-500 border-emerald-500 shadow-sm' 
                : 'border-stone-300 hover:border-emerald-400'
            }`}
          >
            {todo.completed && <Check size={14} className="text-white" />}
          </button>
          
          <div className="flex-1 min-w-0">
            <p className={`text-lg font-light transition-all duration-200 ${
              todo.completed 
                ? 'text-stone-500 line-through' 
                : 'text-stone-700'
            }`}>
              {todo.text}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Added {todo.createdAt.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-stone-400 hover:text-red-500 transition-all duration-200 group"
          >
            <X size={16} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
