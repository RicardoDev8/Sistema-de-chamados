
import { useState, useEffect, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlusCircle } from 'react-icons/fi';
import { AuthContext } from '../../contexts/auth';
import { dataBase } from '../../services/firebaseConections';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { useParams, useNavigate } from 'react-router-dom';

import './new.css'

const listRef = collection(dataBase, 'customers')

export default function New(){

    const {user} =useContext(AuthContext)
    const { id } = useParams()

    const [customers, setCustomers] = useState([])
    const [loadCustomer, setLoadCustomer] = useState(true)
    const [customerSelected, setCustomerSelected] = useState(0)


    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('Aberto')

    const [idCustomer, setIdCustomer] = useState(false)

    const navigate = useNavigate()

    useEffect(()=>{

        async function loadCustomers(){
            const querySnapshot = await getDocs(listRef)
            .then((snapshot)=>{
                let lista = [];

                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(snapshot.docs.size === 0){
                    console.log('NENHUMA EMPRESA ENCONTRADA')
                    setCustomers([{id: '1', nomeFantasia: 'Freela'}])
                    setLoadCustomer(false)
                    return;
                }

                setCustomers(lista)
                setLoadCustomer(false)

                if(id){
                    loadId(lista);
                }
            })
            .catch((error)=>{
                console.log('Erro ao buscar clientes ' + error)
                setLoadCustomer(false)
                setCustomers([{id: '1', nomeFantasia: 'Freela'}])
            })
        }
    

        loadCustomers();
    }, [id])

    async function loadId(lista){
        const docRef = doc(dataBase, 'chamados', id)
        await getDoc(docRef)
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);

            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomerSelected(index)
            setIdCustomer(true)
        }) 
        .catch((error)=>{
            console.log(error)
            setIdCustomer(false)
        }) 
    }


    function handleOptionChange(event){
        setStatus(event.target.value)
    }

    function handleChangeSelect(event){
        setAssunto(event.target.value)
        console.log(event.target.value)
    }

    function handleChangeCustomer(event){
        setCustomerSelected(event.target.value)
    }


    async function handleRegister(event){
        event.preventDefault();

        // Atualizar dados do cliente
        if(idCustomer){
            const docRefe = doc(dataBase, 'chamados', id)
            await updateDoc(docRefe, {
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userId: user.uid
            })
            .then(()=>{
                toast.info('Chamado atualizado com sucesso!')
                setCustomerSelected(0)
                setComplemento('')
                navigate('/dashboard')
            })
            .catch((error)=>{
                toast.error('Ops, erro ao atualizar o chamado!')
                console.log(error)
            })
            return;
        }

        //Registar um cliente
        await addDoc(collection(dataBase, 'chamados'),{
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid
        })
        .then(()=>{
            toast.success('Chamado registrado!')
            setComplemento('')
            setCustomerSelected(0)
            navigate('/dashboard')
        })
        .catch((error)=>{
            toast.error('Ops, erro ao registrar')
            console.log(error)
        })
        
    }

    return(
        <div>
            <Header/>

            <div className='content' >
                <Title name={id ? 'Editando chamado' : 'Novo chamado'} >
                    <FiPlusCircle size={24} />
                </Title>

                <div className='container' >
                    <form className='form-profile' onSubmit={handleRegister} >
                        <label>Clientes</label>
                        {
                            loadCustomer ? (
                                <input type='text' disabled={true} value='Carregando...' />
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer} >
                                    {customers.map((item, index)=>{
                                        return(
                                            <option key={index} value={index} >
                                                {item.nomeFantasia}
                                            </option>
                                        );
                                    })}
                                </select>
                            )
                        }


                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect} >
                            <option value='Suporte' >Suporte</option>
                            <option value='Visita técnica' >Visita Técnica</option>
                            <option value='Financeiro' >Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='status' >
                            <input 
                            type='radio'
                            name='radio'
                            value='Aberto'
                            onChange={handleOptionChange}
                            checked={status === 'Aberto'}
                            />
                            <span>Em aberto</span>

                            <input 
                            type='radio'
                            name='radio'
                            value='Progresso'
                            onChange={handleOptionChange}
                            checked={status === 'Progresso'}
                            />
                            <span>Progresso</span>

                            <input 
                            type='radio'
                            name='radio'
                            value='Atendido'
                            onChange={handleOptionChange}
                            checked={status === 'Atendido'}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                        type='text'
                        placeholder='Digite o seu problem (Opcional)'
                        value={complemento}
                        onChange={(event)=>{setComplemento(event.target.value)}}
                        />

                        <button type='submit' >Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}