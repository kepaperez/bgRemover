import { Link } from "react-router-dom"
import image1 from '../assets/homeImage.jpg';
import arrow from '../assets/arrow-right.svg'
const Home = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '90vh',
            width: '100%',
            justifyContent: 'space-around',
            maxWidth: '80vw',
            flexWrap: 'wrap',
            gap:'25px'

        }}>
            <div style={{

                maxWidth: '80vw',

            }}>
                <h1 >Remove the background of your images <span style={{ textDecoration: 'underline' }}>easily</span></h1>

                <Link to="/tool" className="button1">
                    Use tool
                    <img
                        style={{ color:'white',width:'20px' }}
                        src={arrow} />
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