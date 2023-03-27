import React from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <FullPage>
      <PromptContainer>
        <Prompt>
          <img src={logo} className="logo" alt="Terrastories Logo" />
          <h1>{t('errors.not_found.heading')}</h1>
          <p>{t('errors.not_found.text')}</p>
          <p><Link className="button" to="/">{t('go_back')}</Link></p>
        </Prompt>
      </PromptContainer>
    </FullPage>
  );
}
