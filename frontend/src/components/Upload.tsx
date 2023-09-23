import { useState, useContext } from 'react';
import { AppContext, socket } from '../App';
import { BlockType } from '../../types';
import { incomingSockets } from './helpers/funcs';

interface newRecordData {
    heading: string,
    details: string,
    file: File | null,
    parent: string,
}

const defaultNewBlock: newRecordData = {
    heading: "",
    details: "",
    file: null,
    parent: ""
}

export default () => {
    const { setModalJSX } = useContext(AppContext);

    const [newRecord, setNewRecord] = useState<newRecordData>(defaultNewBlock);

    const handleChangeText = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
        key: keyof typeof newRecord
    ) => {
        const updatedData: newRecordData = {
            ...newRecord,
            [key]: e.target.value
        }
        setNewRecord(updatedData);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setNewRecord({
            ...newRecord,
            file: e.target.files[0],
        });
    }


    const submitForm = () => {
        if (newRecord.file) {
            const fileSizeInMb = newRecord.file.size / (1000 * 1000);
            if (fileSizeInMb > 10) {
                alert("File size should be less than 10MB");
                return;
            }
        }
        const emitData: BlockType = {
            heading: newRecord.heading,
            details: newRecord.details,
            fileName: newRecord.file?.name ?? "N/A",
            parent: newRecord.parent,
            version: 0
        }
        socket.emit('newRecord', emitData, newRecord.file);
        if (setModalJSX) setModalJSX(null);
    }

    const cancelForm = () => {
        if (setModalJSX) setModalJSX(null);
    }

    incomingSockets(() => {
        socket.removeAllListeners('error-uploading');
        socket.removeAllListeners('data-uploaded');

        socket.on('error-uploading', (type: "system" | "no-parent") => {
            alert(type == "system" 
                    ? "Error writing your file, try again!"
                    : "Parent with this id doesn't exist"
            );
        });

        socket.on('data-uploaded', () => {
            alert("The record has been uplaoded to the pending queue, waiting to be mined!");
        });
    });

    return <div className="upload-block">
        <div className="title">New Record</div>
        <div className="form">
            <div className="heading">
                <span>Heading</span>
                <input type="text" autoFocus onChange={e => handleChangeText(e, "heading")} />
            </div>
            <div className="details">
                <span>Details</span>
                <textarea onChange={e => handleChangeText(e, "details")}></textarea>
            </div>
            <div className="file">
                <span>File</span>
                <input type="file" onChange={handleFileChange} accept='.txt'/>
            </div>
            <div className="reference">
                <span>Parent Record Id</span>
                <input type="text" onChange={e => handleChangeText(e, "parent")}/>
            </div>
        </div>    
        <button className="submitNewRecord" onClick={submitForm}>Upload</button><br/>
        <button className='cancelNewRecord' onClick={cancelForm}>Cancel</button>
    </div>
}