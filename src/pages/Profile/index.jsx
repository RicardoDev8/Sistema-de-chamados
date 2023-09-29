import { useContext, useState } from 'react';
import Header from "../../components/Header";
import { AuthContext } from '../../contexts/auth';

import Title from "../../components/Title";
import { FiSettings, FiUpload } from "react-icons/fi";
import avatar from '../../assets/avatar.png';
import { toast } from 'react-toastify';

import { dataBase, storage } from '../../services/firebaseConections';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import './profile.css';

export default function Profile() {

    const { user, storageUser, setUser, logOut } = useContext(AuthContext)

    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)
    const [imageAvatar, setImageAvatar] = useState(null)


    function handleFile(event){
        if(event.target.files[0]){
            const image = event.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png'){
                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(image))
            }else{
                alert('Envie uma imagem do tipo PNG ou JPEG')
                setAvatarUrl(null)
                return;
            }
        }
    }

    function exit(){
        logOut();
        toast.info('VOCÊ SAIU')
    }

    async function handleUpload(){
        const currentUid = user.uid;

        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)
        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot)=>{
            
            getDownloadURL(snapshot.ref).then(async (downloadURL)=>{
                let urlImage = downloadURL;

                const docRef = doc(dataBase, 'users', user.uid)
                await updateDoc(docRef, {
                    avatarUrl: urlImage,
                    nome: nome
                })
                .then(()=>{
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlImage
                    }
                    setUser(data)
                    storageUser(data)
                    toast.success('Atualizado com sucesso!',{
                        theme: 'colored'
                    })
                })
            })

        })
    }


    async function handleSubmit(event){
        event.preventDefault();
        
        if(imageAvatar === null && nome !== ''){
            const docRef = doc(dataBase, 'users', user.uid )
            await updateDoc(docRef, {
                nome: nome
            })
            .then(()=>{
                let data = {
                    ...user,
                    nome: nome
                }
                setUser(data)
                storageUser(data)
                toast.success('Atualizado com sucesso!',{
                    theme: 'colored'
                })
            })
        }else if(nome !== '' && imageAvatar !== null){
            handleUpload();
        }
    }


    return (
        <div>
            <Header />
            <div className='content'>
                <Title name='Minha conta' >
                    <FiSettings size={24} />
                </Title>

                <div className='container' >
                    <form className='form-profile' onSubmit={handleSubmit} >
                        <label className='label-avatar' >
                            <span>
                                <FiUpload color='#FFF' size={24} />
                            </span>
                            <input type='file' accept='image/*' onChange={handleFile} /> <br />
                            {avatarUrl === null ? (
                                <img src={avatar} alt='foto de perfil' width={250} height={250} />
                            ) : (
                                <img src={avatarUrl} alt='foto de perfil' width={250} height={250} />
                            )}
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(event)=>{setNome(event.target.value)}} />
                        <label>Email</label>
                        <input type="email" value={email} disabled={true}/>
                        <button type='submit' >Salvar</button>
                    </form>
                </div>
                <div className='container' >
                    <button className='btn-logout' onClick={exit} >Sair</button>
                </div>
            </div>
        </div>
    );
}






