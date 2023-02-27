import React from 'react';
import { Link } from "react-router-dom";

import styled from 'styled-components';

import logo from 'logo.svg';
import "./styles.css";

const FullPage = styled.div`
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif;
  background-color: #09697E;
  height: 100vh;
`;

const PromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #09697E;
  height: 80vh;
`;

const Prompt = styled.div`
  background-color: #FFFFFF;
  opacity: .70;
  text-align: center;
  padding: 2em;
  border-radius: 25px;
`;

export default function NotFound() {
  return (
    <FullPage>
      <PromptContainer>
        <Prompt>
          <img src={logo} className="logo" alt="Terrastories Logo" />
          <h1>Oops, wrong turn!</h1>
          <p>The page you were looking for doesn't exist.</p>
          <p>Let's return to Terrastories: <Link className="button" to="/">Go to the home page</Link></p>
        </Prompt>
      </PromptContainer>
    </FullPage>
  );
}
