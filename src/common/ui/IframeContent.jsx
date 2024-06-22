import {useRef, useEffect} from 'react';

export default function IframeContent(props) {
    const {html, ...others} = props
    const iframeRef = useRef(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentWindow.document;
            doc.open();
            doc.write(html);
            doc.close();
        }
    }, [html]);

    return <iframe ref={iframeRef} {...others} />
}