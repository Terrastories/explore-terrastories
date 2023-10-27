import React, {ReactNode} from "react"
import styled from "styled-components"

import Icon from "components/Icon"

const Details = styled.details`
> :not(summary) {
  margin-left: 11px;
}
`

const Summary = styled.summary`
display: flex;
align-items: center;

svg { flex-shrink: 0; }

cursor: pointer;
`

type CollapsibleContainerProps = {
  icon?: string,
  labelText: string,
  children: ReactNode,
}

export default function CollapsibleContainer({icon, labelText, children}: CollapsibleContainerProps) {
  return (
    <Details>
      <Summary>
        {icon && <Icon icon={icon} alt={icon} />}
        {labelText}
      </Summary>
      {children}
    </Details>
  )
}
