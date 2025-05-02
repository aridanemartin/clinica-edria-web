'use client'

import { useState } from "react";
import { auth } from "@/firebase/client";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password)
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password)
      }
      
      // Redirect to the patient's dashboard using their UID
      if (userCredential.user) {
        router.push(`/paciente/${userCredential.user.uid}`)
      }
    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</button>
      <button type="button" onClick={() => setIsLogin(!isLogin)}>Cambiar a {isLogin ? 'registro' : 'login'}</button>
    </form>
  )
}
