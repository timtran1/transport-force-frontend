import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getFileNameFromAttachUrl, getFileExtension, getAttachmentUrl} from "../utils/index.js";
import {faFileLines} from "@fortawesome/free-solid-svg-icons";
import {Indicator} from '@mantine/core';
import BackendHostURLState from "../stores/BackendHostURLState.js";
import documentIcon from '../../assets/images/document.png';
import imageIcon from '../../assets/images/placeholder.png';

export default function FileDisplay(props) {
    const {
        label = '',
        alt = 'Image',
        width = 40,
        height = 40,
        src,
        type,
    } = props

    let {placeholder} = props;
    if (!placeholder) {
        placeholder = type === 'image' ? imageIcon : documentIcon
    }
    const {backendHost} = BackendHostURLState(state => state)

    return (
        <div className={`relative`}>
            {label &&
                <div style={{
                    fontSize: `var(--input-label-size,var(--mantine-font-size-sm))`,
                    fontWeight: 500,
                    marginBottom: '0.5rem'
                }}>
                    {label}
                </div>
            }

            {src ? (
                    type === 'image' ?
                        <img src={getAttachmentUrl(backendHost, src)} alt={alt} width={width} height={height}/>
                        :
                        <a className="flex items-end cursor-pointer text-primary-main"
                           href={getAttachmentUrl(backendHost, src)} target="_blank"
                           rel={'noreferrer'}>
                            <Indicator label={getFileExtension(src).toUpperCase()} size={15}>
                                <FontAwesomeIcon icon={faFileLines} style={{width: `${width}px`, height: `${height}px`}}/>
                            </Indicator>
                            <div className="ml-2 !underline">
                                {getFileNameFromAttachUrl(src)}
                            </div>
                        </a>

                )
                :
                <img src={placeholder} alt={alt} width={width} height={height} className="object-cover"/>
            }
        </div>
    )
}
