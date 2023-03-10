import React from 'react'

import CommunityItem from './components/CommunityItem'

import { TypeCommunity } from 'types'

import './styles.css'

export default function CommunityList({communities}: {communities: TypeCommunity[]}) {
  return (
    <div className={'communityGrid'}>
      {communities && communities.map((c) => (
        <CommunityItem key={c.slug} {...c} />
      ))}
      {!communities.length &&
        <div className='emptyGrid'>No public communities</div>}
    </div>
  )
}
