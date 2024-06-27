import Modal from "../UI/Modal";
import styles from "./Cart.module.css";
import { useContext, useState } from "react";
import React from "react";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import SubmitOrder from "./SubmitOrder";

const Cart = (props) => {
    const cartContext = useContext(CartContext);
    const [isSubmitOrderAvialable, setIsSubmitOrderAvialable] = useState(false);
    const [isDataSubmitting, setIsDataSubmitting] = useState(false);

    const [wasDataSendingSucsessful, setWasDataSendingSucsessful] =
        useState(false);
    const totalAmount = `$${Math.abs(cartContext.totalAmount).toFixed(2)}`;
    const hasItems = cartContext.items.length > 0;

    const removeCartItemHandler = (id) => {
        cartContext.removeItem(id);
    };

    const addCartItemHandler = (item) => {
        cartContext.addItem({ ...item, amount: 1 });
    };

    const orderHandler = () => {
        setIsSubmitOrderAvialable(true);
    };

    const submitOrderHandler = async (userData) => {
        setIsDataSubmitting(true);

        const response = await fetch(
            "https://react-course-http-30914-default-rtdb.firebaseio.com/orders.json",
            {
                method: "POST",
                body: JSON.stringify({
                    user: userData,
                    orderedMeals: cartContext.items,
                }),
            }
        );

        setIsDataSubmitting(false);
        setWasDataSendingSucsessful(true);
        cartContext.clearCart();
    };
    const cartItems = (
        <ul className={styles["cart-items"]}>
            {cartContext.items.map((item) => (
                <CartItem
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onAdd={addCartItemHandler.bind(null, item)}
                    onRemove={removeCartItemHandler.bind(null, item.id)}
                />
            ))}
        </ul>
    );
    const cartModalContent = (
        <React.Fragment>
            {cartItems}
            <div className={styles.total}>
                <span>Итого</span>
                <span>{totalAmount}</span>
            </div>
            {isSubmitOrderAvialable && (
                <SubmitOrder
                    onCancel={props.onHideCart}
                    onSubmit={submitOrderHandler}
                ></SubmitOrder>
            )}
            {!isSubmitOrderAvialable && (
                <div className={styles.actions}>
                    <button
                        className={styles["button--alt"]}
                        onClick={props.onHideCart}
                    >
                        Закрыть
                    </button>
                    {hasItems && (
                        <button
                            className={styles.button}
                            onClick={orderHandler}
                        >
                            Заказать
                        </button>
                    )}
                </div>
            )}
        </React.Fragment>
    );

    const dataSubmittingCartModalContent = <p>Отправка данных зказа...</p>;
    const dataWasSubmittingCartModalContent = <p>Заказ принят!</p>;
    return (
        <Modal onHideCart={props.onHideCart}>
            {!isDataSubmitting && !wasDataSendingSucsessful && cartModalContent}
            {isDataSubmitting && dataSubmittingCartModalContent}
            {wasDataSendingSucsessful && dataWasSubmittingCartModalContent}
        </Modal>
    );
};

export default Cart;
