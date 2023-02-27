import React from 'react';
import { Link } from "react-router-dom";

import logo from 'logo.svg';

import './styles.css';

import PublicCommunities from 'components/PublicCommunities';

function Home() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">
            <img src={logo} className="logo" alt="Terrastories Logo" />
          </Link>
        </nav>
      </header>
      <main>
        <PublicCommunities />
      </main>
    </>
  );
}

export default Home;
