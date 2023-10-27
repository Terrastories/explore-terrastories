import type { ReactNode } from "react"
import styled from "styled-components"

const StyledHeading = styled.div`
margin-top: 0.5rem;

h1 {
  font-size: 1.4rem;
  margin: 0.25rem 0px 0.5rem
}
`

export default function Heading({title, children}:{title: string, children?: ReactNode}) {
  return (
    <StyledHeading>
      {children}
      <h1>{title}</h1>
    </StyledHeading>
  )
}
