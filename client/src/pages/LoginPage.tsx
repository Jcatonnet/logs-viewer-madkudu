import useAuth from "../hooks/useAuth";

const LoginPage = () => {
    const { login } = useAuth();

    return (
        <div className="text-center">
            <h3>Please log in to view your logs</h3>
            <button className="btn btn-primary" onClick={login}>
                Log In
            </button>
        </div>


    )
}
export default LoginPage
