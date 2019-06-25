import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <header className="header"> Crowd-Funding App </header>
        <div className="content">
        <h1>Project Title</h1>
          <h2>Short description about this project</h2>
        <img alt="project"/>
        </div>
        <div className="sidebar">
        <h3 className="project-amount">$8,000 pledged of $3,000 goal</h3>
        <h3 className="project-backers">521 backers</h3>
        <h3 className="project-deadline">23 days to go</h3>
        <button className="button">Back This Project</button>
        </div>
      </div>
    );
  }
}

export default App;
