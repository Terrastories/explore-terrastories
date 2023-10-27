import React from "react"
import styled from "styled-components"

const StyledInput = styled.input`
padding: 0.5rem 0.75rem;
width: 100%;
border-radius: 6px;
border: 1px solid #efefef;
margin: 0.25rem 0;
`

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <StyledInput {...props} />
  )
}
