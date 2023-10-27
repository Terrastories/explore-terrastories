import React from "react"
import styled from "styled-components"

const RingWrapper = styled.div`
display: flex;
align-items: center;
justify-content: center;

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`

const Ring = styled.div<{ $size?: number; }>`
display: inline-block;
position: relative;
width: ${props => (props.$size ? props.$size * 1.25 : 80)}px;
height: ${props => (props.$size ? props.$size * 1.25 : 80)}px;

div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: ${props => props.$size || 64}px;
  height: ${props => props.$size || 64}px;
  border: ${props => (props.$size ? props.$size/8 : 8)}px solid #666;
  margin: ${props => (props.$size ? props.$size/8 : 8)}px;
  border-radius: 50%;
  animation: rotate 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #666 transparent transparent transparent;
}

div:nth-child(1) {
  animation-delay: -0.45s;
}
div:nth-child(2) {
  animation-delay: -0.3s;
}
div:nth-child(3) {
  animation-delay: -0.15s;
}
`

export default function Loading({size}: {size?: number}) {
  return (
    <RingWrapper>
      <Ring $size={size}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </Ring>
    </RingWrapper>
  )
}
