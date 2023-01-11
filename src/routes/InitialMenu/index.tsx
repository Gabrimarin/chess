import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function InitialMenu() {
  const uuid = crypto.randomUUID();

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          border: `1px solid black`,
          padding: 20,
          borderRadius: 10,
        }}
      >
        <h1>Chessy Mate</h1>
        <Link to={"local"}>
          <Button
            style={{
              width: "100%",
            }}
          >
            <h2>Local match</h2>
          </Button>
        </Link>
        <div style={{ height: 20 }} />
        <Link to={"online/" + uuid}>
          <Button>
            <h2>Online match</h2>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InitialMenu;
