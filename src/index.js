import React from 'react';
import ReactDOM from 'react-dom';
import './scss/App.scss';

console.log('Webpack setup ====>');

function App() {
  return (
    <div>
      <h1>React App </h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));
