// src/App.js
import React from 'react';
import Try from '../components/Try'; 

const App = () => {
  return (
    <div>
      <Try title="Click Me" onClick={() => console.log('Button clicked!')} />
    </div>
  );
};

export default App;
