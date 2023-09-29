
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import {AuthContext} from '../../contexts/auth'
import { toast } from 'react-toastify';

import './signin.css';


export default function SignIn(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {signIn, loadingAuth} = useContext(AuthContext) 

    async function handleSignIn(event){
        event.preventDefault();

        if(email !== '' && password !== ''){
           await signIn(email, password)
        }else{
            toast.warn('PREENCHA TODOS OS CAMPOS')
        }
    }

    return(
        <div className="container-center" >
            <div className="login" >
                <div className="login-area" >
                    <img src={logo} alt="logo do aplicativo de chamados" />
                </div>
                <form onSubmit={handleSignIn} >
                    <h1>Entrar</h1>
                    <input 
                    type="text" 
                    placeholder='Digite seu email'
                    value={email}
                    onChange={(event)=> {setEmail(event.target.value)}}
                    />
                    <input 
                    type="password"
                    placeholder='**********'
                    value={password}
                    onChange={(event)=> {setPassword(event.target.value)}}
                    />
                    <button type='submit' >
                    { loadingAuth ? 'Carregando...' : 'Acessar' }
                    </button>
                </form>
                <Link to='/register' >Crie sua conta</Link>
            </div>
        </div>
    );
}

