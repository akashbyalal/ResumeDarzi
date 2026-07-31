import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authContext } from "../services/auth.context";
import {login, register, logout, getMe} from "../services/auth.api"

export const useAuth = ()=>{

    const context = useContext(authContext)
    const {user, setUser, loading, setLoading} = context;
    const navigate = useNavigate();

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
            navigate("/login", { replace: true })
            return true
        } catch(err){
            console.log(err)
            return false
        } finally{
            setLoading(false)
        }
    }
 

    return {user, loading, handleRegister, handleLogin, handleLogout}


}