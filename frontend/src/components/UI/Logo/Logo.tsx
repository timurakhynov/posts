import './Logo.css';
import Logotype from '../../../assets/img/logo.png';
import { Link } from "react-router-dom";

const Logo: React.FunctionComponent = () => {
    return (
        <Link to={'/'} className={"Logo"}>
            <img className="w-100" src={Logotype} alt="Posts" />
        </Link>
    );
};

export default Logo;