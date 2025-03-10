import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare, FaGithubSquare, FaLinkedin } from "react-icons/fa";

export default interface RedeSocial{
    texto: string
    icone: React.ReactElement,
    link: string
}

const listaDeRedesSociais: RedeSocial[] = [
    {
        icone: <AiFillInstagram />,
        link: 'https://www.instagram.com/eudimimartins/',
        texto: 'Instagram'
    },
    {
        icone: <FaFacebookSquare />,
        link: 'https://www.facebook.com/dimi.martins.376',
        texto: 'Facebook'
    },
    {
        icone: <FaGithubSquare />,
        link: 'https://github.com/dimiendrixmmiranda/dimiendrixmmiranda',
        texto: 'Github'
    },
    {
        icone: <FaLinkedin />,
        link: 'https://www.linkedin.com/in/dimi-endrix-martins-miranda-86a017341/',
        texto: 'Github'
    },
]

export {
    listaDeRedesSociais
}