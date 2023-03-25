import Select from 'react-select/async'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'

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
      <h2>Switch Communities</h2>
      <Select
        defaultOptions
        loadOptions={loadOptions}
        menuPortalTarget={document.body}
        placeholder='Select a Community'
        noOptionsMessage={(a)=> `No communities match '${a.inputValue}'`}
        onChange={opt => {
          if (!opt) return
          navigate(`/community/${opt.value}`)
          handleClose()
        }}
      />
      <MiniNavBar>
        <Link to="/">or view all</Link>
      </MiniNavBar>
    </Modal>
  )
}