import { useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export const Signup = () => {
    const [mail, setMail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function check(){
      const token = localStorage.getItem("token")
      if(token){
        const res = await axios.get("http://localhost:3000/api/v1/user/check", {
          headers:{
                  Authorization: "Bearer " + localStorage.getItem("token")
                }
        })
        if(res.status===200){
          navigate("/dashboard")
        }
      }
    } 
    check()
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox onChange={e => {
          setUsername(e.target.value);
        }} placeholder="John" label={"Username"} />
        <InputBox onChange={(e) => {
          setPassword(e.target.value)
        }} placeholder="123456" label={"Password"} />
        <InputBox onChange={e => {
          setMail(e.target.value);
        }} placeholder="harkirat@gmail.com" label={"Email"} />
        <div className="pt-4">
          <Button onPress={async () => {
            const response = await axios.post("http://localhost:3000/api/v1/user/signup",{
              username,
              password,
              mail
            });
            localStorage.setItem("token", response.data.token)

            navigate("/dashboard")
          }} label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
      </div>
    </div>
  </div>
}