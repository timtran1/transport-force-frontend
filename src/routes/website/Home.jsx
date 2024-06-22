import {useEffect, useState} from 'react';
import {Html5QrcodeScanner, Html5QrcodeSupportedFormats} from "html5-qrcode";

export default function Home() {
    const [cleared, setCleared] = useState(false);
    const [result, setResult] = useState(null);
    const [type, setType] = useState('');
    const [html5QrcodeScanner, setHtml5QrcodeScanner] = useState(null);

    useEffect(() => {
        render_scan_qr();
    }, []);

    const render_scan_qr = async () => {
        setCleared(false);
        setResult(null);

        const onScanSuccess = async (decodedText, decodedResult) => {
            console.log(`Code matched = ${decodedText}`, decodedResult);

            // try {
            //     console.log('clearing');
            //     html5QrcodeScanner.clear();
            //     setCleared(true);
            //
            //     let res = await fetch(`/get?name=${decodedText}`);
            //     const response = await res.json();
            //     console.log(response);
            //
            //     if (response.car) {
            //         setResult(response.car);
            //         setType('car');
            //     } else if (response.transmitter) {
            //         setResult(response.transmitter);
            //         setType('transmitter');
            //     } else {
            //         alert('Not found!');
            //     }
            //
            // } catch (e) {
            //     console.error(e);
            //     alert('Invalid QR content!');
            //     html5QrcodeScanner.resume();
            // }
        };

        const onScanFailure = (error) => {
            console.warn(`Code scan error = ${error}`);
        };

        let scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 1,
                qrbox: {width: 250, height: 250},
            },
            /* verbose= */ false,
        );
        await scanner.render(onScanSuccess, onScanFailure);

        setHtml5QrcodeScanner(scanner);
    };

    return (
        <div>
            <header>
                <h1>Scan QR Code</h1>
            </header>
            <div id="reader" style={{width: '300px'}}></div>
            {result && <InfoDisplay object={result} type={type}/>}
            <div>
                {cleared && <button onClick={render_scan_qr}>Scan another</button>}
            </div>
        </div>
    );
}