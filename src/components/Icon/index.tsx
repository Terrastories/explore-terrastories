import LanguageWorldIcon from "./assets/language.svg?react"
import PinIcon from "./assets/pin.svg?react"
import GridIcon from "./assets/gridView.svg?react"
import ListIcon from "./assets/listView.svg?react"
import SortIcon from "./assets/sort.svg?react"
import CloseIcon from "./assets/closeX.svg?react"
import AudioIcon from "./assets/volume.svg?react"
import ImageIcon from "./assets/image.svg?react"
import VideoIcon from "./assets/video.svg?react"
import DocumentIcon from "./assets/fileAttached.svg?react"
import ChevronRightIcon from "./assets/chevronRight.svg?react"

export default function Icon({icon, alt}:{icon: string, alt: string}) {
  switch (icon) {
  case "language":
    return <LanguageWorldIcon/>
  case "pin":
    return <PinIcon/>
  case "grid":
    return <GridIcon/>
  case "list":
    return <ListIcon/>
  case "sort":
    return <SortIcon/>
  case "close":
    return <CloseIcon/>
  case "audio":
    return <AudioIcon/>
  case "image":
    return <ImageIcon />
  case "video":
    return <VideoIcon />
  case "application":
    return <DocumentIcon />
  case "pdf":
    return <DocumentIcon />
  case "chevron-right":
    return <ChevronRightIcon />
  default:
    throw new Error(`Icon does not exist: ${icon}`)
  }
}
