import { useState } from 'react';
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiUser } from 'react-icons/fi';

import { dataBase } from '../../services/firebaseConections';
import { addDoc, collection } from 'firebase/firestore';

import { toast } from 'react-toastify';

export default function Costumers() {

    const [nome, setNome] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [endereco, setEndereco] = useState('')

    async function handleRegister(event){
        event.preventDefault();

        if(nome !== '' && cnpj !== '' && endereco !== ''){
            await addDoc(collection(dataBase, 'customers'), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(()=>{
                setNome('')
                setCnpj('')
                setEndereco('')
                toast.success('Empresa cadastrada!')
            })
            .catch((error)=>{
                console.log('Erro ao cadastrar a empresa ' + error)
            })
        }else{
            toast.warn('Preencha todos os campos')
        }
    }

    return (
        <div>
            <Header />
            <div className='content' >
                <Title name='Clientes' >
                    <FiUser size={24} />
                </Title>
                <div className='container' >
                <form className='form-profile' onSubmit={handleRegister} >
                    <label>Nome fantasia</label>
                    <input 
                    type="text"
                    placeholder="Nome da empresa"
                    value={nome}
                    onChange={(event)=>{setNome(event.target.value)}}
                    />
                    <label>CNPJ</label>
                    <input 
                    type="text"
                    placeholder='Informe o cnpj'
                    value={cnpj}
                    onChange={(event)=>{setCnpj(event.target.value)}}
                    />
                    <label>Enndereço</label>
                    <input 
                    type="text"
                    placeholder='Digite o endereço'
                    value={endereco}
                    onChange={(event)=>{setEndereco(event.target.value)}}
                    />
                    <button type='submit' >
                        Salvar
                    </button>
                </form>
            </div>
            </div>
        </div>
    );
}