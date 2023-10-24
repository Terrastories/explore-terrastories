import React from 'react'
import styled from 'styled-components'

import Icon from 'components/Icon'

import type { ReactNode } from 'react'

const BreadcrumbContainer = styled.span`
  display: flex;
  align-items: center;
  color: rgb(0 0 0 / 60%);
  margin-bottom: 0.25rem;

  span, span[role='link'] {
    line-height: 18px;
    font-size: 14px;
    color: rgb(0 0 0 / 60%);
  }

  svg {
    flex-shrink: 0;
    height: 18px;
    width: 18px;
    fill: rgb(0 0 0 / 60%);
  }

  .iconGroup {
    display: flex;
    align-items: center;

    .clampTitle {
      // Override clamp break on word
      // to break everywhere so it fills
      // breadcrumb spacing.
      word-break: break-all;
    }
  }
`

export default function Breadcrumbs({children}:{children: ReactNode}) {
  return(
    <BreadcrumbContainer>
      {React.Children.toArray(children).map((child, i) => {
        if (i > 0) {
          return(<React.Fragment key={i}>
            <Icon icon='chevron-right' alt='next' />
            {child}
          </React.Fragment>)
        } else {
          return(<React.Fragment key={i}>{child}</React.Fragment>)
        }
      })}
    </BreadcrumbContainer>
  )
}