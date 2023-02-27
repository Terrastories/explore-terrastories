import React from 'react';
import { Outlet } from "react-router-dom";

import './styles.css';

export default function Layout() {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}
