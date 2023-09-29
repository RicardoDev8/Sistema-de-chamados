
import {useState, useContext} from 'react';
import {AuthContext} from '../../contexts/auth';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';


export default function SignUp(){

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {signUp, loadingAuth} = useContext(AuthContext)


    async function handleSignUp(event){
        event.preventDefault();

        if(name !== '' && email !== '' && password !== ''){
           await signUp(email, password, name)
        }
    }


    return(
        <div className="container-center" >
            <div className="login" >
                <div className="login-area" >
                    <img src={logo} alt="logo do site de chamados" />
                </div>
                <form onSubmit={handleSignUp} >
                    <h1>Nova conta</h1>
                    <input 
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(event)=>{setName(event.target.value)}}
                    />
                    <input 
                    type="text"
                    placeholder="Informe seu email"
                    value={email}
                    onChange={(event)=>{setEmail(event.target.value)}}
                    />
                    <input 
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(event)=>{setPassword(event.target.value)}}
                    />
                    <button type="submit">
                        {loadingAuth ? 'Carregando...' : 'Cadastrar'}
                    </button>
                </form>
                <Link to="/" >Já possui conta? Faça login</Link>
            </div>
        </div>
    );
}