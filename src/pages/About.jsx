import React from "react";

function About() {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h2>About This App</h2>
      <p>
        This is a Todo List application built with React and React Router. It
        allows users to include the following: Add, complete, update, and search
        todos. The app also allows you to fetch the data from an external API
        (Airtable) and managing state with the useReducer hook.
      </p>
      <p>
        Author: Mylea Spicer. This project is a learning exercise in modern
        React patterns.
      </p>
    </div>
  );
}

export default About;
