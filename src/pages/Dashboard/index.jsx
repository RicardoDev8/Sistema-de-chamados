import { useContext, useState, useEffect } from 'react';
import { AuthContext } from "../../contexts/auth";

import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2, FiDelete } from 'react-icons/fi';

import { Link, useParams } from 'react-router-dom';
import { 
    collection, 
    getDocs, 
    orderBy, 
    limit, 
    startAfter, 
    query, 
    deleteDoc, 
    doc, 
    updateDoc, 
    onSnapshot
} from 'firebase/firestore';
import { dataBase } from '../../services/firebaseConections';
import { format } from 'date-fns';
import Modal from '../../components/Modal';
 
import './dashboard.css';

const listRef = collection(dataBase, 'chamados')

export default function Dashboard() {

    const { logOut } = useContext(AuthContext);

    const [chamados, setChamados] = useState([])
    const [loading, setLoading] = useState(true)

    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDocs, setLastDocs] = useState()
    const [loadingMore, setLoadingMore] = useState(false)

    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState()

    const { id } = useParams();

    useEffect(()=>{

        async function loadChamados(){
            const q = query(listRef, orderBy('created', 'desc'), limit(5));

            const querySnapshot = await getDocs(q)
            setChamados([])
            await updateState(querySnapshot)

            setLoading(false)
        }

        loadChamados();

        return ()=> {}
    }, [])

    async function updateState(querySnapshot){
        const isCollectionEmpty = querySnapshot.size === 0;

        if(!isCollectionEmpty){
            let lista = []

            querySnapshot.forEach((doc)=>{
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]

            setChamados(chamados=> [...chamados, ...lista])
            setLastDocs(lastDoc)
        }else{
            setIsEmpty(true)
        }

        setLoadingMore(false)
    }

    async function handleLogOut() {
        await logOut();
        toast.info('VOCÊ SAIU');
    }

    async function handleMore(){
       setLoadingMore(true)
       const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5))
    
       const querySnapshot = await getDocs(q);
       await updateState(querySnapshot);
    }

    function toggleModal(item){
        setShowPostModal(!showPostModal)
        setDetail(item)
        
    }


    async function deleteChamado(id){
       const valorRef = doc(dataBase, 'chamados', id)
      await deleteDoc(valorRef)
      .then(()=>{
        location.reload()
      })
      .catch((error)=>{
        console.log(error)
      })

      
    }

    if(loading){
        return(
            <div>
                <Header/>
                <div className="content">
                <Title name='Tickets' >
                    <FiMessageSquare size={24} />
                </Title>
                <div className='container dashboard' >
                    <span>Buscando chamados...</span>
                </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className='content'>
                <Title name='Tickets' >
                    <FiMessageSquare size={24} />
                </Title>

                <>

                    {chamados.length === 0 ? (
                        <div className='container dashboard' >
                            <span>Nenhum chamado encontrado </span>
                            <Link to='/new' className='new' >
                            <FiPlus color='#FFF' size={24} />
                            Novo chamado
                            </Link>
                            <button onClick={handleLogOut} >Sair</button>
                        </div>
                    ) : (
                        <>
                        <Link to='/new' className='new' >
                        <FiPlus color='#FFF' size={24} />
                        Novo chamado
                        </Link>             
                    <table>
                        <thead>
                            <tr>
                                <th scope='col' >Cliente</th>
                                <th scope='col'>Assunto</th>
                                <th scope='col'>Status</th>
                                <th scope='col'>Cadastrado em</th>
                                <th scope='col'>#</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chamados.map((item, index)=>{
                                return(
                                    <tr key={index} >
                                    <td data-label='Cliente'>{item.cliente}</td>
                                    <td data-label='Assunto'>{item.assunto}</td>
                                    <td data-label='Status'>
                                        <span className='badge' style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }} >{item.status}</span>
                                    </td>
                                    <td data-label='Cadastrado'>{item.createdFormat}</td>
                                    <td data-label='#' >
                                        <button className='action' style={{ backgroundColor: '#3583f6' }} onClick={()=> toggleModal(item)} >
                                            <FiSearch color='#FFF' size={17} />
                                        </button>
                                        <Link to={`/new/${item.id}`} className='action' style={{ backgroundColor: '#f6a935' }} >
                                            <FiEdit2 color='#FFF' size={17} />
                                        </Link>
                                        <button className='action' style={{backgroundColor: '#dd0000'}} onClick={()=> deleteChamado(item.id)} >
                                            <FiDelete color='#FFF' size={17} />
                                        </button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {loadingMore && <h3>Buscando mais chamados...</h3>}
                    {!loadingMore && !isEmpty && <button onClick={handleMore} className='btn-more' >Buscar mais</button>}
                    <button onClick={handleLogOut} className='btn-exit' >Sair</button>
                        </>
                    )}
                </>
            </div>
            {showPostModal && (
                <Modal
                conteudo={detail}
                close={()=> setShowPostModal(!showPostModal)}
                />
            )}
        </div>
    );
}



// async function deleteTarefa(id){
//     const vlaorRef = doc(bancoDeDados, 'tarefas', id)
//     deleteDoc(vlaorRef)
//     toast.success('VOCÊ FINALIZOU MAIS UMA TAREFA, PARABÉNS!', {
//      theme: 'colored'
//     })
//  }



