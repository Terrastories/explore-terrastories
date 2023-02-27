import styled from 'styled-components'

import { useCommunity } from 'contexts/CommunityContext'

import Loading from 'components/Loading'

import { TypeCommunityDetails } from 'types'

const Logo = styled.img`
  width: 100%;
`

const ExplorePanel = styled.div`
  margin-top: 1rem;
  overflow-x: hidden;
  overflow-y: scroll;
  overflow-wrap: break-word;

  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1.25rem;
  }
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
  details: TypeCommunityDetails
}

export default function ExporeIntro({details}: Props) {
  const {
    name,
    description,
    sponsorLogos,
    displayImage,
  } = details

  const { loading, handleShowStories } = useCommunity()

  const defaultHeading = 'Welcome!'
  const defaultDescription = 'Terrastories are audiovisual recordings of place-based storytelling. This offline-compatible application enables local communities to locate and map their own oral storytelling traditions about places of significant meaning or value to them.'

  return (
    <ExplorePanel>
      {displayImage &&
        <Logo src={displayImage} alt={name} />}
      <h1>{name || defaultHeading}</h1>
      <p>{description || defaultDescription}</p>
      <p>
        <Button disabled={loading} onClick={handleShowStories}>
          {loading && <Loading />}
          Start Exploring
        </Button>
      </p>
      {sponsorLogos &&
        <SponsorLogos>
          {sponsorLogos.map((logo) => (
            <img key={logo.blobId} src={logo.url} alt={'sponsor'} />
          ))}
        </SponsorLogos>}
    </ExplorePanel>
  )
}
