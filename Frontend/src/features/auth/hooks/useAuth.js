import { useContext } from "react";
import { authContext } from "../services/auth.context";
import {login, register, logout, getMe} from "../services/auth.api"

export const useAuth = ()=>{

    const context = useContext(authContext)
    const {user, setUser, loading, setLoading} = context;

    const handleLogin = async ({username, password}) => {
        setLoading(true)
        try{
            const data = await login({username, password})
            if (data?.user) {
                setUser(data.user)
                return true
            }
            return false
        } catch(err){
            console.log(err)
            return false
        } finally{
            setLoading(false)
        }
    }

    const handleRegister = async ({username, email, password}) => {
        setLoading(true)
        try{
            const data = await register({username, email, password})
            setUser(data?.user ?? null)
            return true
        } catch(err){
            console.log(err)
            return false
        } finally{
            setLoading(false)

        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try{
            await logout()
            setUser(null)
        } catch(err){
            console.log(err)
        } finally{
            setLoading(false)

        }
    }
 

    return {user, loading, handleRegister, handleLogin, handleLogout}


}