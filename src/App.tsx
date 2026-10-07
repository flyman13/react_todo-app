/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useState, useEffect } from 'react';
import { TodoContext } from './TodoContext';
import { TodoItem } from './TodoItem';

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const context = useContext(TodoContext);

  if (!context) {
    throw new Error('TodoContext must be used within TodoProvider');
  }

  const { todos, addTodo, toggleAll, clearCompleted } = context;

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash === '#/active') {
        setFilter('active');
      } else if (hash === '#/completed') {
        setFilter('completed');
      } else {
        setFilter('all');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initialize on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const newTodoInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    newTodoInputRef.current?.focus();
  }, [todos]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      addTodo(newTodoTitle);
      setNewTodoTitle('');
    }

    newTodoInputRef.current?.focus();
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const allCompleted = todos.length > 0 && activeTodos.length === 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form onSubmit={handleAddSubmit}>
            <input
              ref={newTodoInputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              autoFocus
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${activeTodos.length} item${activeTodos.length === 1 ? '' : 's'} left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={`filter__link ${
                    filter === 'all' ? 'selected' : ''
                  }`}
                  data-cy="FilterLinkAll"
                >
                  All
                </a>
                <a
                  href="#/active"
                  className={`filter__link ${
                    filter === 'active' ? 'selected' : ''
                  }`}
                  data-cy="FilterLinkActive"
                >
                  Active
                </a>
                <a
                  href="#/completed"
                  className={`filter__link ${
                    filter === 'completed' ? 'selected' : ''
                  }`}
                  data-cy="FilterLinkCompleted"
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={clearCompleted}
                disabled={completedTodos.length === 0}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
