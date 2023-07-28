import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useCommunity } from 'contexts/CommunityContext'

import { TypeCommunityDetails } from 'types'

const ExplorePanel = styled.div`
  margin-top: 1rem;
  margin-bottom: auto;
  overflow-x: hidden;
  overflow-y: auto;
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
  margin: 0.5rem auto;

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
  const { t } = useTranslation(['community'])
  const {
    name,
    description,
    sponsorLogos,
    displayImage
  } = details

  const { dismissIntro } = useCommunity()

  return (
    <ExplorePanel>
      {displayImage && <h1>{name}</h1>}
      <p>{description}</p>
      <Button onClick={dismissIntro}>
        {t('start_exploring')}
      </Button>
      {sponsorLogos.length > 0 &&
        <>
        <h2>{t('sponsors')}</h2>
        <SponsorLogos>
          {sponsorLogos.map((logo) => (
            <img key={logo.blobId} src={logo.url} alt={'sponsor'} />
          ))}
        </SponsorLogos>
        </>}
    </ExplorePanel>
  )
}
