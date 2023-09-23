import { useState } from "react"
import { BlockAsJSON } from '../../types';
import { incomingSockets, runOnce } from "./helpers/funcs";
import { socket } from "../App";

//@ts-ignore;
import down from 'download-as-file';

export default () => {
    const [blocks, setBlocks] = useState<BlockAsJSON[]>([]);

    const download = (file: string) => {
        socket.emit('downloadFile', file);
    }

    runOnce(() => {
        socket.emit('getAllBlocks');
    });

    incomingSockets(() => {
        socket.removeAllListeners( 'allBlocks');
        socket.removeAllListeners('update-recents');
        socket.removeAllListeners('downFile');

        socket.on('allBlocks', (newBlocks: BlockAsJSON[]) => setBlocks(newBlocks));
        socket.on('update-recents', () => {
            socket.emit('getAllBlocks');
        });
        socket.on('downFile', (name: string, content: string) => {
            down({
                data: content,
                filename: name,
            });
        });
    });

    return <div className="blocks">
        
        { blocks.length ? 
            blocks.map((blo, i) => {
                return <div className="recent-block" key={i}>
                    <div className="head">{blo.data.heading}</div>
                    <div 
                        className="filename" 
                        title={blo.data.fileName} 
                        onClick={() => download(blo.data.fileName)}
                    >
                        Download File
                    </div>
                    <div className="time">{new Date(blo.timestamp).toUTCString()}</div>
                </div>
            })
            : <div className="noblocks">there are no records yet...</div> }
    </div>
}