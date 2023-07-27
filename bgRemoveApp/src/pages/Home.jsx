import { Link } from "react-router-dom"
import image1 from '../assets/homeImage.jpg';
const Home = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '90vh',
            width: '100%',
            justifyContent: 'space-around'



        }}>
            <div style={{
                maxWidth: '500px'
            }}>
                <h1 >Remove the background of your images <span style={{ textDecoration: 'underline' }}>easily</span></h1>
    
                <Link to="/tool" className="navLink">
                    <button className="button1">
                        Use tool
                    </button>
                </Link>

            </div>
            <div>
                <img
                    style={{ height: '30rem' }}
                    src={image1} />
            </div>
        </div>

    )
}

export default Home