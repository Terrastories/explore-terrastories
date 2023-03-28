import Select from 'react-select/async'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Modal from 'components/Modal'

import { getCommunities } from 'api/communityApi'

import type { TypeCommunity } from 'types'

type SwitcherModalProps = {
  handleClose: () => void
}

const MiniNavBar = styled.div`
  margin-top: 0.5rem;
  text-align: right;
`

export default function CommunitySwitcherModal({handleClose}: SwitcherModalProps) {
  const { t, i18n } = useTranslation(['translation', 'community'])
  const navigate = useNavigate()

  const loadOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      getCommunities(inputValue)
      .then((resp) => {
        callback(resp.data.map((c: TypeCommunity) => ({value: c.slug, label: c.name})))
      })
    }, 600);
  }

  return (
    <Modal onClose={() => handleClose()}>
      <h2>{t('switch_communities')}</h2>
      <Select
        defaultOptions
        loadOptions={loadOptions}
        menuPortalTarget={document.body}
        placeholder={t('select_a_resource', {resource: 'Community'})}
        noOptionsMessage={(a)=> t('no_match', {resource: 'communities', input: a.inputValue})}
        onChange={opt => {
          if (!opt) return
          navigate(`/${i18n.language}/community/${opt.value}`)
          handleClose()
        }}
      />
      <MiniNavBar>
        <Link to="/">{t('community:view_all')}</Link>
      </MiniNavBar>
    </Modal>
  )
}