
import { useState, createContext, useEffect } from 'react';
import { auth, dataBase } from '../services/firebaseConections';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, waitForPendingWrites } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';

export const AuthContext = createContext({})

export default function AuthProvider({children}){

    const [user, setUser] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()


    useEffect(()=>{
        async function loadUser(){
            const storageUser = localStorage.getItem('@ticker')

            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }

            setLoading(false)
        }

        loadUser();
    }, [])

    async function signIn(email, password){
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
        .then(async (value)=>{
            let uid = value.user.uid

            const docRef = doc(dataBase, 'users', uid)
            const docSnap = await getDoc(docRef)

            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl
            }

            setUser(data)
            storageUser(data)
            setLoadingAuth(false)
            toast.success('BEM VINDO DE VOLTA!')
            navigate('/dashboard')
        })
        .catch((error)=>{
            console.log('erro ao fazer login ' + error)
            toast.error('EMAIL OU SENHA INVÁLIDOS', {
                theme: 'colored'
            })
            setLoadingAuth(false)
        })
    }

    async function signUp(email, password, name){
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value)=>{
            let uid = value.user.uid

            await setDoc(doc(dataBase, 'users', uid), {
                nome: name,
                avatarUrl: null
            })
            .then(()=>{
                
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                };

                setUser(data);
                storageUser(data)
                setLoadingAuth(false)
                toast.success('SUA CONTA FOI CRIADA COM SUCESSO!', {
                    theme: 'colored'
                })
                navigate('/dashboard')
            })
        })
        .catch((error)=>{
            console.log('Erro ao cadastrar ' + error)
        })
    }

    function storageUser(data){
        localStorage.setItem('@ticker', JSON.stringify(data))
    }

    async function logOut(){
        await signOut(auth);
        localStorage.removeItem('@ticker');
        setUser(null)
    }

    return(
        <AuthContext.Provider value={{
            signed: !!user, // Vai ser falso enquanto a useState estiver vazia (null)
            user,
            signIn,
            signUp,
            logOut,
            loadingAuth,
            loading,
            storageUser,
            setUser
        }} >
            {children}
        </AuthContext.Provider>
    );
}







