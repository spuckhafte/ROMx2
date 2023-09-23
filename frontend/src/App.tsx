import { io } from "socket.io-client"
import Features from "./components/Features";
import Blocks from "./components/Blocks";
import { useEffect, useState } from "react";
import Modal from "./components/Modal";
import { createContext } from "react";
import Upload from "./components/Upload";
import Search from "./components/Search";
import { incomingSockets } from "./components/helpers/funcs";


export const socket = io('http://localhost:3000');
const SMALL_W = 580;
const SMALL_H = 5;

export const AppContext = createContext<{ 
    modalJSX?: JSX.Element | null, 
    setModalJSX?: React.Dispatch<React.SetStateAction<JSX.Element | null>>
}>({});

export default () => {
    const [windowSize, setWindowSize] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const [modalJSX, setModalJSX] = useState<JSX.Element | null>(null);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWindowSize(window.innerWidth);
            setWindowHeight(window.innerHeight);
        })
    });

    useEffect(() => {
        document.body.style.overflowY = !modalJSX ? "auto" : "hidden";
    }, [modalJSX]);

    function uploadRecordClicked() {
        setModalJSX(<Upload />);
    }

    function accessRecordClicked() {
        setModalJSX(<Search />);
    }

    function mine() {
        socket.emit('mine');
    }

    incomingSockets(() => {
        socket.removeAllListeners('error-adding-block');
        socket.removeAllListeners('block-added');

        socket.on('error-adding-block', (status: string) => {
            alert(status);
        });

        socket.on('block-added', (status: string) => {
            alert(status);
        })
    })

    return (
        <AppContext.Provider
            value={{ modalJSX, setModalJSX }}
        >
            <Modal jsx={modalJSX} />
            <main>
                <div className="heading">
                    <img src="./logo.jpg" alt="" />
                    <div className="text">
                        blockchain based <Features /> eVault
                    </div>
                </div>
                <div className="face">
                    <div className="buttons">
                        <button className="upload" onClick={uploadRecordClicked}>Upload Record</button>
                        <button className="download" onClick={accessRecordClicked}>Access Record</button>
                        <button className="mine" onClick={mine}>Verify Record</button>
                    </div>
                    {
                        windowSize >= SMALL_W && windowHeight >= SMALL_H
                            ? <img src="./img.png" alt="img" />
                            : ""
                    }
                </div>

                <Blocks />
                <div className="empty"></div>
            </main>
        </AppContext.Provider>
    )
}