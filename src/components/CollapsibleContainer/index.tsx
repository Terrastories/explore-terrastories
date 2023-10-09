import React, {ReactNode} from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const Container = styled.div<{$showMoreLabel: string, $showLessLabel: string, $contentHeight: string}>`
position: relative;
margin-top: 0.5rem;

#collapsibleObserver {
  margin-top: 1px;
}

> div {
  height: ${props => props.$contentHeight};
  overflow-y: hidden;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

label {
  position: absolute;
  top: 100%;
  width: 100%;
  text-align: center;
  line-height: 2rem;
}
input {
  display: none;
}
label:after {
  content: "${props => props.$showMoreLabel}";
}
label:hover:after {
  cursor: pointer;
}
input:checked + label:after {
  content: "${props => props.$showLessLabel}";
}

input:checked ~ div {
  height: 100%;
  display: block;
  -webkit-line-clamp: unset;
  max-height: 40vh;
  overflow-y: auto;
}
`

type EmptyListProps = {
  showMoreLabel?: string,
  showLessLabel?: string,
  contentHeight?: string,
  children: ReactNode
}

export default function CollapsibleContainer({showMoreLabel, showLessLabel, contentHeight, children}: EmptyListProps) {
  const { t } = useTranslation(['community'])

  const [staticContent, setStaticContent] = React.useState<boolean>(true)

  React.useEffect(() => {
    const el = document.querySelector('#collapsibleObserver')

    if (el === null) return

    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio < 1) {
          setStaticContent(false)
        }
      },
      {threshold: [1]}
    );

    observer.observe(el);
  }, [])

  return (
    <Container $showMoreLabel={showMoreLabel || t('show_more')} $showLessLabel={showLessLabel || t('show_less')} $contentHeight={contentHeight || "1.9rem"}>
      <input id="ch" type="checkbox" />
      {!staticContent && <label htmlFor="ch"></label>}
      <div className="content">
        {children}
        <span id="collapsibleObserver"></span>
      </div>
    </Container>
  )
}
