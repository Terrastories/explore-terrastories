import LanguageWorldIcon from './assets/language.svg'
import PinIcon from './assets/pin.svg'
import GridIcon from './assets/gridView.svg'
import ListIcon from './assets/listView.svg'
import SortIcon from './assets/sort.svg'
import CloseIcon from './assets/closeX.svg'
import SpeakerIcon from './assets/speakerPhone.svg'

export default function Icon({icon, alt}:{icon: string, alt: string}) {
  var src
  switch (icon) {
    case 'language':
      src = LanguageWorldIcon
      break
    case 'pin':
      src = PinIcon
      break
    case 'grid':
      src = GridIcon
      break
    case 'list':
      src = ListIcon
      break
    case 'sort':
      src = SortIcon
      break
    case 'close':
      src = CloseIcon
      break
    case 'speaker':
      src = SpeakerIcon
      break
    default:
      throw new Error('Icon does not exist')
  }
  return (
    <img src={src} alt={alt} />
  )
}
