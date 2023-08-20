
import { useEffect, useState,useRef } from 'react'
import {useStoreUser } from '../../../store/hooks'
import './checkout.css'
import { useForm } from "react-hook-form";
import { createOrder } from '../../../service/order.service';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCart } from '../../../hooks/useCart';
const Checkout = () => {
  const accessToken = JSON.parse(localStorage.getItem('accessToken')!)
  const { cart, dispatch } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const isFirstRender = useRef(true);
  const {user} = useStoreUser()
  const navigate = useNavigate()
  useEffect(() => {
    if (!accessToken) {
      navigate("/auth/login")
    } 
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else if(cart?.products?.length==0) {
      navigate("/")
    }
  }, [accessToken,cart])
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data: any) => {
    data["cartId"] = cart._id
    Swal.fire({
      title: 'Are you sure order?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oki'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true)
        createOrder(data).then(() => {
          dispatch({
            type: 'DELETE_ALL_PRODUCTS_IN_CART'
          })
          navigate('/message')
          return
        })
          .catch((error) => alert(error))
      }
    })
  };
  return (
    <div className='checkout-main'>
      <div className="checkout" style={{ position: "relative" }}>
        <h3>Checkout</h3> {isLoading ? <img height={100} style={{ position: "absolute", top: "100px", zIndex: "1", left: "5", right: "0" }} src="https://i.gifer.com/ZKZg.gif" /> : ""
        } {user &&
          <form className="formCheckout" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="">CustomerName</label> <br />
              <input value={user.name} type="text" {...register("customerName", { required: true })} /> <br />
              {errors.customerName?.type === 'required' && <span style={{ color: "#f12" }}>This is required</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label> <br />
              <input defaultValue={user.phone} type="text" {...register("phone", { required: true, pattern: /^0[0-9]{9}$/ })} /> <br />
              {errors.phone?.type === 'required' && <span style={{ color: "#f12" }}>This is required</span>}
              {errors.phone?.type === 'pattern' && <span style={{ color: "#f12" }}>Place enter valid phone number</span>}
              <div className="form-group">
                <label htmlFor="">Address</label> <br />
                <input type="text" {...register("address", { required: true })} /> <br />
                {errors.address?.type === 'required' && <span style={{ color: "#f12" }}>This is required</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="">Note</label> <br />
              <textarea  {...register("note")} />
            </div>
            <input type="radio" name="" id="" style={{ marginTop: "10px" }} checked /> Payment on delivery
            <div className="form-group">
              <button>Place order</button>
            </div>
          </form>
        }
      </div>
      <div className="cart">
        <h4>Perfume selected</h4>
        {cart?.products?.map((product: any) => {
          const sum = product.price * product.quantity
          return (
            <div className="cartItem">
              <div className="c_productInCart">
                <div className="cart_product_image">
                  <img src={product.productId.image} alt="" />
                  <p >{product.quantity}</p>
                </div>
                <div className="cart_product">
                  <p>{product.productId.name} ( {product.sizeId.name} )</p>
                </div>
              </div>
              <div className="cart_product_totalPrice">
                <p style={{ color: "#f12" }}>${sum}</p>
              </div>
            </div>
          )
        }
        )}
        <h3 id='cartTotalPrice'>TotalPrice: ${cart.totalPrice}</h3>
      </div>
    </div>
  )
}

export default Checkout