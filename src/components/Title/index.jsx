
import './title.css';
import { FiSettings } from 'react-icons/fi';


export default function Title({children, name}){
    return(
        <div className='title' >
            {children}
            <span>{name}</span>
        </div>
    );
}




