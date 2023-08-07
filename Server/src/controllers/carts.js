import Cart from "../models/carts"
import Products from "../models/products"
// add cart
export const addToCart = async (req, res) => {
    try {
        const { quantity, productId, userId, sizeId, price } = req.body

        let cart = await Cart.findOne({ userId: userId })
        if (!cart) {
            cart = await Cart.create({
                userId: userId,
                products: [],
                totalPrice: 0
            })
        }
        const productIndex = cart.products.find(item => item.productId == productId && item.sizeId == sizeId)
        if (!productIndex) {
            cart.products.push({
                productId,
                sizeId,
                price,
                quantity,

            })

            //C2: dùng $push để thêm ptu vào mảng trong mongoDB
            //cart.updateOne({ $push: { products: { productId: productId, price: price, quantity: quantity }}})

        } else {
            console.log(productIndex.quantity, quantity);
            productIndex.quantity += quantity
        }
        cart.totalPrice += parseInt(price) * parseInt(quantity)


        cart.save()
        await cart.populate("products.productId")
        return res.status(201).json({
            message: "Create cart successfully",
            cart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
//Update quantity of product in cart
export const updateCart = async (req, res) => {
    try {
        const { quantity, productId, userId, sizeId } = req.body
        console.log(quantity, productId, userId);
        //tìm trong giỏ hàng theo idUser

        let cart = await Cart.findOne({ userId: userId })

        console.log("Cart :", cart);
        //tìm idProduct để sánh
        const productExits =  cart.products.find(item => item.productId == productId && item.colorId == colorId)
        console.log("exits :", productExits);
        const product = await Products.findById(productId)
        const price = product.price
        if (productExits.quantity > quantity) {
            console.log("Giam")

            console.log("Cũ:", productExits.quantity + "mới: ", quantity);
            cart.totalPrice = cart.totalPrice - (price * (productExits.quantity - quantity))
        } else {
            console.log("Tăng");

            cart.totalPrice = cart.totalPrice + (price * (quantity - productExits.quantity))
        }

        //tính lại tổng tiền xog mới cập nhật lại số lượng
        productExits.quantity = quantity
        cart.save()
        await cart.populate("products.productId")

        return res.status(201).json({
            message: "Update cart successfully",
            cart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
//Xóa 1 sản phẩm (.) giỏ hàng
export const removeOneProductInCart = async (req, res) => {
    try {
        const { userId, sizeId,price ,quantity} = req.body
        console.log("idU:", userId, "idP:", req.params.id);
        //tìm trong giỏ hàng theo idUser
        let cart = await Cart.findOne({ userId: userId })

        //tìm idProduct để sánh
        const productExits = cart.products.find(item => item.productId == req.params.id )
        console.log("product: ", productExits);
        
        const productIndex = cart.products.indexOf(productExits)

        cart.products.splice(productIndex, 1)

         cart.totalPrice = cart.totalPrice - (productExits.price * productExits.quantity)
      
        cart.save()
        await cart.populate("products.productId")
        await cart.populate("products.sizeId")
        return res.status(201).json({
            message: "Remove one product in cart successfully",
            cart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
//C2 dùng $pull trong mongoDB
//await cart.updateOne({ $pull: { products: { productId: req.params.id }}});


//Lấy giỏ hàng theo idUser
export const getCartUser = async (req, res) => {
    try {
        //tìm trong giỏ hàng theo idUser
        let cart = await Cart.findOne({ userId: req.params.id })
        if (!cart) {
            return res.json({
                message: "Cart empty",
            })
        }
        await cart.populate("products.sizeId")
        await cart.populate("products.productId")

        return res.status(201).json({
            message: "Get cart successfully",
            cart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}