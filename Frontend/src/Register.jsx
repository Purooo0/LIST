import React from 'react';
import ReadingList from './components/ReadingList';
import ToDoList from './components/TodoList';
import HabitTrackerList from './components/HabitTrackeList';

function App() {
    return (
        <div className="App">
            <ReadingList />
            <ToDoList />
            <HabitTrackerList/>
        </div>
    );
}

export default App;
