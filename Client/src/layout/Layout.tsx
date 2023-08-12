
import Header from '../components/header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/footer/Footer'

interface IProps {
  user: any
  
}
const Layout = () => {
  return (
    <div className='container-f'>
      <Header   ></Header>
      
      <Outlet></Outlet>
    
      <Footer></Footer>
    </div>


  )
}

export default Layout