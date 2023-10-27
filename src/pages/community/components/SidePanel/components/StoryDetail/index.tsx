import styled from "styled-components"

import CollapsibleContainer from "components/CollapsibleContainer"
import Heading from "components/Heading"
import Icon from "components/Icon"
import Media from "components/Media"

import SpeakerList from "./components/SpeakerList"

import { useCommunity } from "contexts/CommunityContext"
import { useMapConfig } from "contexts/MapContext"
import type { GeoJsonProperties, Feature, Point } from "geojson"

import type { TypeStory } from "types"

const StoryDetailContainer = styled.div`
overflow-x: hidden;
overflow-y: auto;
margin-bottom: auto;
`

const Section = styled.section`
background-color: #fff;
box-shadow: 0 1px 4px rgba(102,102,102, 0.1);
overflow-wrap: break-word;
white-space: pre-wrap;
`

const PlaceDetail = styled(Section)`
border-radius: 0 1rem 1rem;
font-size: 0.9rem;

padding: 0.5rem;

margin-top: 0.25rem;
margin-bottom: 0.5rem;
`


const StorySection = styled(Section)`
margin-top: 0.5rem;
padding: 1rem;
`

export default function StoryDetail() {
  const { selectedStory } = useCommunity()
  const { moveCenter } = useMapConfig()

  const {
    title,
    topic,
    language,
    desc,
    media,
    speakers,
    places,
  } = selectedStory as TypeStory

  const centerMapOnPlace = (point?: Feature<Point, GeoJsonProperties>) => {
    if (!point) return
    moveCenter(point)
  }

  return (
    <>
      <Heading title={title}>
        {topic && <span className="badge square">{topic}</span>}
        {language &&
          <span className={"badge square"}>
            <Icon icon={"language"} alt={"language"} />
            {language}
          </span>}
      </Heading>
      <StoryDetailContainer>
        {places && places.map((p) => (
          <div key={p.id} onClick={() => centerMapOnPlace(p.center)}>
            <CollapsibleContainer labelText={p.name} icon={"pin"}>
              {p.description && <PlaceDetail>{p.description}</PlaceDetail>}
            </CollapsibleContainer>
          </div>
        ))}
        {speakers && <SpeakerList speakers={speakers} />}

        { desc && <StorySection>{desc}</StorySection>}

        { media && media.map((m) => (
          <StorySection key={m.blob}>
            <Media {...m} />
          </StorySection>
        ))}
      </StoryDetailContainer>
    </>
  )
}
