import React from 'react'
import { useTranslation } from 'react-i18next'

import EmptyList from 'components/EmptyList'

import CommunityItem from './components/CommunityItem'

import { TypeCommunity } from 'types'

import './styles.css'

export default function CommunityList({communities}: {communities: TypeCommunity[]}) {
  const { t } = useTranslation()
  return (
    <div className={'communityGrid'}>
      {communities &&
        communities.map((c) => (
          <CommunityItem key={c.slug} {...c} />
        ))
      }
      {!communities.length &&
        <EmptyList message={t('errors.empty', {resources: t('communities')})} />}
    </div>
  )
}
