// @ts-nocheck
import styled from 'styled-components'

import Loading from 'components/Loading'

import { TypeCommunityDetails } from 'types'
import './styles.css'

const Logo = styled.img`
  width: 100%;
`
const Button = styled.button`
  background-color: #09697e;
  color: #fff;
  padding: 0.5rem 1rem;
  border: 1px solid #09697e;
  border-radius: 3px;
  position: relative;
  width: 100%;
  margin: 0.2rem;

  &:hover {
    cursor: pointer;
    background-color: #05323a;
  }

  &:disabled {
    background-color: #ccc;
    border-color: #ccc;
  }

  > .ringWrapper {
    position: absolute;
    left: 50%;
    margin-left: -10px;
  }
`
const SponsorLogos = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 0.5rem;

  img {
    width: 100%;
  }
`

type Props = {
  loading: boolean,
  details: TypeCommunityDetails,
  handleShowAll: () => void,
}

export default function ExporeIntro(props: Props) {
  const {
    name,
    description,
    sponsorLogos,
    displayImage,
  } = props.details

  const {
    loading, handleShowAll
  } = props

  const defaultHeading = 'Welcome!'
  const defaultDescription = 'Terrastories are audiovisual recordings of place-based storytelling. This offline-compatible application enables local communities to locate and map their own oral storytelling traditions about places of significant meaning or value to them.'

  return (
    <div className={'explorePanel'}>
      {displayImage &&
        <Logo src={displayImage} alt={name} />}
      <h1>{name || defaultHeading}</h1>
      <p>{description || defaultDescription}</p>

      <h2>Start exploring {name}</h2>
      <p>Start exploring by selecting from the filters above, or click below to explore all stories.</p>

      <p>
        <Button disabled={loading} onClick={handleShowAll}>
          {loading && <Loading />}
          Explore
        </Button>
      </p>
      {sponsorLogos &&
        <SponsorLogos>
          {sponsorLogos.map((logo) => (
            <img key={logo.blobId} src={logo.url} alt={'sponsor'} />
          ))}
        </SponsorLogos>}
    </div>
  )
}
