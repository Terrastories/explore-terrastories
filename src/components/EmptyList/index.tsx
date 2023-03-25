import React from 'react'
import styled from 'styled-components'

const Box = styled.div`
display: flex;
justify-content: center;
align-items: center;
margin-bottom: auto;
`

type EmptyListProps = {
  message?: string
}

export default function EmptyList({message}: EmptyListProps) {
  return (
    <Box>
      {
        message || 'There are no results'
      }
    </Box>
  )
}
