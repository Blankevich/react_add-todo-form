import './App.scss';
import React, { useState } from 'react';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { User } from './types/User';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';

function getUser(userId: number): User | null {
  const foundUser = usersFromServer.find(user => user.id === userId);

  // if there is no user with a given userId
  return foundUser || null;
}

const todos: Todo[] = todosFromServer.map(todo => ({
  ...todo,
  user: getUser(todo.userId),
}));

let timeId = Math.max(...todos.map(todo => todo.id));

const newTodo = (title: string, userId: number): Todo => ({
  id: timeId,
  userId,
  title,
  completed: false,
  user: getUser(userId),
});

const addTodo = (title: string, id: number) => {
  timeId += 1;
  const todo = newTodo(title, id);

  todos.push(todo);
};

export const App = () => {
  const [title, setTitle] = useState('');
  const [user, setUser] = useState('');
  const [errosUser, setErrorUser] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);

  const changeUser = (event:
  { target: { value: React.SetStateAction<string>; }; }) => {
    setErrorUser(false);
    setUser(event.target.value);
  };

  const changeTitle = (event:
  { target: { value: React.SetStateAction<string>; }; }) => {
    setTitle(event.target.value);
  };

  const checkForm = () => {
    setErrorTitle(!title);
    setErrorUser(!user);

    return title && user;
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (checkForm()) {
      addTodo(title, +user);
      setTitle('');
      setUser('');
    }
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        action="/api/users"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label>
            Title:
            <input
              type="text"
              name="title"
              placeholder="Enter a title"
              data-cy="titleInput"
              value={title}
              onChange={changeTitle}
            />
          </label>
          {errorTitle && (<span className="error">Please enter a title</span>)}
        </div>

        <div className="field">
          <label>
            User:
            <select
              data-cy="userSelect"
              name="user"
              value={user}
              onChange={changeUser}
            >
              <option value="">Choose a user</option>
              {usersFromServer.map(({ id, name }) => (
                <option value={id} key={id}>{name}</option>
              ))}
            </select>
          </label>
          {errosUser && (<span>Please choose a user</span>)}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>
      <TodoList todos={todos} />
    </div>
  );
};
