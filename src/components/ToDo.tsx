import React, { useState, useEffect } from 'react';
import './style.css';
// ToDoリストのタスクの型を定義
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// フィルターの型を定義
type Filter = 'all' | 'todo' | 'done';

const ToDo = () => {
  // ★ 変更点: sessionStorage を localStorage に変更
  // ページがロードされたときにlocalStorageからタスクを取得
  // JSON.parseを使用して文字列をオブジェクトの配列に戻す
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos'); // sessionStorage → localStorage
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ★ 変更点: sessionStorage を localStorage に変更
  // todosの状態が変更されるたびにlocalStorageに保存
  // JSON.stringifyを使用してオブジェクトの配列を文字列に変換する
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos)); // sessionStorage → localStorage
  }, [todos]);

  // 新しいタスクを追加する
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault(); // ページの再読み込みを防ぐ
    if (!input.trim()) return; // 入力が空の場合は何もしない

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInput(''); // 入力フォームをクリア
  };

  // タスクの完了状態を切り替える
  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // 個別のタスクを削除する
  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 完了したタスクをすべて削除する
  const handleDeleteCompleted = () => {
    // ユーザーに確認を促すUIを表示
    setShowDeleteConfirm(true);
  };

  // 削除を確定する
  const confirmDelete = () => {
    setTodos(todos.filter((todo) => !todo.completed));
    setShowDeleteConfirm(false);
  };

  // 削除をキャンセルする
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // フィルターに基づいて表示するタスクを決定する
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'todo') return !todo.completed;
    if (filter === 'done') return todo.completed;
    return true;
  });

  return (
    <div>
      {/* 入力フォーム */}
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="新しいToDoを入力"
        />
        <button type="submit">追加</button>
      </form>

      {/* フィルターボタン */}
      <div>
        <button onClick={() => setFilter('all')}>すべて</button>
        <button onClick={() => setFilter('todo')}>ToDo</button>
        <button onClick={() => setFilter('done')}>完了</button>
      </div>

      {/* タスクリスト */}
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id} style={{ textDecoration: todo.completed && filter === 'all' ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
            />
            <span style={{ margin: '0 10px' }}>{todo.text}</span>
            <button onClick={() => handleDeleteTodo(todo.id)}>×</button>
          </li>
        ))}
      </ul>

      {/* 完了したToDoをすべて削除するボタン */}
      <button onClick={handleDeleteCompleted}>チェックしたToDoをすべて削除</button>

      {/* 削除確認メッセージ（alertの代替） */}
      {showDeleteConfirm && (
        <div style={{ border: '1px solid black', padding: '10px', marginTop: '10px' }}>
          <p>本当にチェックしたToDoをすべて削除しますか？</p>
          <button onClick={confirmDelete}>はい</button>
          <button onClick={cancelDelete}>いいえ</button>
        </div>
      )}
    </div>
  );
};

export default ToDo;