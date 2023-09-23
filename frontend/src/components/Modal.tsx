import { useContext } from 'react';
import { AppContext } from '../App';

export default (props: { jsx: JSX.Element|null }) => {
    const { setModalJSX } = useContext(AppContext);
    
    function bgClicked(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!e.target) return;

        if (
            setModalJSX && 
            (e.target as unknown as HTMLDivElement).className === "modal-bg"
        ) setModalJSX(null);
    }

    return <>
        {
            props.jsx 
                ? <div className="modal-bg" onClick={bgClicked}>
                    { props.jsx }
                </div>
                : ""
        }
    </>
}