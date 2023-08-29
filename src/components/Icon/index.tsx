import {ReactComponent as LanguageWorldIcon } from './assets/language.svg'
import {ReactComponent as PinIcon } from './assets/pin.svg'
import {ReactComponent as GridIcon } from './assets/gridView.svg'
import {ReactComponent as ListIcon } from './assets/listView.svg'
import {ReactComponent as SortIcon } from './assets/sort.svg'
import {ReactComponent as CloseIcon } from './assets/closeX.svg'
import {ReactComponent as AudioIcon } from './assets/volume.svg'
import {ReactComponent as ImageIcon } from './assets/image.svg'
import {ReactComponent as VideoIcon } from './assets/video.svg'
import {ReactComponent as DocumentIcon } from './assets/fileAttached.svg'

export default function Icon({icon, alt}:{icon: string, alt: string}) {
  switch (icon) {
    case 'language':
      return <LanguageWorldIcon/>
    case 'pin':
      return <PinIcon/>
    case 'grid':
      return <GridIcon/>
    case 'list':
      return <ListIcon/>
    case 'sort':
      return <SortIcon/>
    case 'close':
      return <CloseIcon/>
    case 'audio':
      return <AudioIcon/>
    case 'image':
      return <ImageIcon />
    case 'video':
      return <VideoIcon />
    case 'application':
      return <DocumentIcon />
    case 'pdf':
      return <DocumentIcon />
    default:
      throw new Error(`Icon does not exist: ${icon}`)
  }
}
