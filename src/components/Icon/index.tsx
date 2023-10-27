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
    return <LanguageWorldIcon title={alt}/>
  case "pin":
    return <PinIcon title={alt}/>
  case "grid":
    return <GridIcon title={alt}/>
  case "list":
    return <ListIcon title={alt}/>
  case "sort":
    return <SortIcon title={alt}/>
  case "close":
    return <CloseIcon title={alt}/>
  case "audio":
    return <AudioIcon title={alt}/>
  case "image":
    return <ImageIcon title={alt}/>
  case "video":
    return <VideoIcon title={alt}/>
  case "application":
    return <DocumentIcon title={alt}/>
  case "pdf":
    return <DocumentIcon title={alt}/>
  case "chevron-right":
    return <ChevronRightIcon title={alt}/>
  default:
    throw new Error(`Icon does not exist: ${icon}`)
  }
}
