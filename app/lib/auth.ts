import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from "next-auth";

interface sessiontype extends User  {
    id:string
    username:string
    email:string
    password:string
}

export const NEXTAUTH = {
    providers:[
        CredentialsProvider({
            name:"Email",
            credentials:{
                email:{label:"Email", placeholder:"Email"},
                password:{label:"password",placeholder:"password"}
            },
            async authorize(credentials:any):Promise<sessiontype | null>{
                // console.log(credentials)
                return (
                    {
                    id:credentials.userid,
                    username:credentials.username,
                    email:credentials.email,
                    password:credentials.password
                }
                )
            }
        }),
    ],
    secret:process.env.NEXTAUTH_SECRET,
    pages: {
        error: "../api/auth/error",  
        signIn:"../api/auth/signin",  
        newUser: undefined             
    },

    callbacks: {
        jwt: async ({ user, token }: any) => {
            // console.log("user is " ,user)
            // console.log("token0 is :",token)
            if (user) {
                token.uid = user.id;
                token.name = user.username
                token.pass = user.password
                // console.log("token is : ",token)
            }
            return token;
        },
      session: async({ session, token }: any) => {
        // console.log("session and token : ",session,token)
        session.user.username = token.name
        session.user.userid = token.uid
        session.user.password = token.pass
        session.user.email = token.email
        return session
      }
    },
}

