import './App.css';
import React, { useState } from 'react';

const buttonStyle = {
  backgroundColor: "white",
  alignItems: "center",
  background: "#FFFFFF",
  border: "0 solid #E2E8F0",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  boxSizing: "border-box",
  color: "#1A202C",
  display: "inline-flex",
  fontFamily: "Inter, sans-serif",
  fontSize: "1rem",
  fontWeight: 600,
  height: "59px",
  justifyContent: "center",
  lineHeight: "50px",
  overflowWrap: "break-word",
  padding: "10px",
  textDecoration: "none",
  width: "auto",
  borderRadius: "8px",
  cursor: "pointer",
  userSelect: "none",
  touchAction: "manipulation",
}
function CustomTable({ motionList }) {
  const tableStyle = {
    borderCollapse: "collapse",
    border: "2px solid black",
    fontFamily: "sans-serif",
    fontSize: "0.8rem",
    letterSpacing: "1px",
    textAlign: "center"
  }
  const tStyle = {
    border: "1px solid black",
    padding: "10px",
  }

  const post2Server = () => {
    fetch("http://localhost:4040/move",
      {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify(motionList)
      })
      .catch((err) => console.log(err))

  }

  return(
    <table style={tableStyle}>
      <thead>
        <tr> <th style={tStyle}>Sequence</th> </tr>
      </thead>
      <tbody>
        {
          motionList.map( (motion) => {
            return(
              <tr>
                <td style={tStyle}>
                  {motion}
                </td>
              </tr>
            )
          })
        }
      </tbody>
      <tfoot>
        <tr><td style={tStyle}>
          <button style={buttonStyle} onClick={post2Server}>Move</button>
        </td></tr>
      </tfoot>
    </table>
  )
}

function App() {
  const containerStyle = {
    backgroundColor: "black",
    height: "100vh",
    width: "100wv",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap"
  }
  const topStyle = {
    backgroundColor: "blue",
    height: "60vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px"
  }
  const bottomStyle = {
    backgroundColor: "purple",
    height: "40vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    padding: "0px 50px"
  }
  const sequenceStyle = {
    backgroundColor: "green",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  const [motionList, setMotionList] = useState(['Home']);
  const handleAxisButtons = (newMotion) => {
    if(newMotion !== 'reset')
      setMotionList(prevList => [...prevList, newMotion]);
    else
      setMotionList(['Home']);
  }

  return (
    <div style={containerStyle}>
      <div style={topStyle}>
        <div style={{display:"flex", gap:"20px"}}>
          <button style={buttonStyle} onClick={() => handleAxisButtons("+Y")}>+Y</button>
          <button style={buttonStyle} onClick={() => handleAxisButtons("+Z")}>+Z</button>
        </div>
        <div style={{display:"flex", width:"80%", justifyContent: "space-between"}}>
          <button style={buttonStyle} onClick={() => handleAxisButtons("-X")}>-X</button>
          <button style={buttonStyle} onClick={() => handleAxisButtons("+X")}>+X</button>
        </div>
        <div style={{display:"flex", gap:"20px"}}>
          <button style={buttonStyle} onClick={() => handleAxisButtons("-Y")}>-Y</button>
          <button style={buttonStyle} onClick={() => handleAxisButtons("+Z")}>-Z</button>
        </div>
      </div>
      <div style={bottomStyle}>
        <button style={buttonStyle} onClick={() => handleAxisButtons("reset")}>Reset</button>
      </div>
      <div style={sequenceStyle}>
        <CustomTable motionList={motionList} />
      </div>
    </div>
  );
}

export default App;
