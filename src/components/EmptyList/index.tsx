import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <Box>
      {
        message || t('errors.empty', {resources: 'results'})
      }
    </Box>
  )
}
