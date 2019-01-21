import React from "react";
import { Link } from "react-router-dom";

const MenuList = () => {
  return (
    <ul style={{ listStyle: "none" }}>
      <li>
        <Link to="/" replace>
          Home
        </Link>
      </li>
      <li>
        <Link to="/lineartilerender" replace>
          Svg tiles with react and redux
        </Link>
      </li>
      <li>
        <Link to="/georasterrender" replace>
          Geographic map with react and redux
        </Link>
      </li>
      <li>
        <Link to="/mapsContainer" replace>
          Svg maps container list-popup
        </Link>
      </li>
      <li>
        <Link to="/singleschemarender" replace>
          Rendering signle tile st schema
        </Link>
      </li>
      <li>
        <Link to="/surfacedemo" replace>
          Surface demo applyuing zoom
        </Link>
      </li>
      <li>
        <Link to="/expScaleMapRender" replace>
          Exp scale example
        </Link>
      </li>
    </ul>
  );
};

export default MenuList;
