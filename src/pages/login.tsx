import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";


function VerifyToken() {
    return <p>Verifying...</p>
}

function LoginPage() {

    const [success, setSuccess] = useState(false)

    const { handleSubmit, register } = useForm<CreateUserInput>()
    const router = useRouter()

    const { mutate, error } = trpc.useMutation(['users.request-otp'], {
        onError: () => { },
        onSuccess: () => {
           setSuccess(true)
         }
    })

    const hash = router.asPath.split('#token=')[1]

    if (hash) {}

    function onSubmit(values: CreateUserInput) {
        mutate(values)
    }

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            {error && error.message}

            {success && <p>Check your email</p>}
            <h1>Login</h1>
            <input type="email" placeholder="john.doe@example.com" {...register('email')} />
            <button type="submit">Login</button>
        </form>
        <Link href="/register">Register</Link>
    </>
}

export default LoginPage;