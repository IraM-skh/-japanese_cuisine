import styles from "./MealList.module.css";
import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import { useEffect, useState } from "react";

// const DUMMY_MEALS = [
//   {
//     id: "m1",
//     name: 'Ролл "Наоми"',
//     description:
//       "Сыр Филадельфия, куриное филе, масаго, помидор, огурец, кунжут",
//     price: 11.99,
//   },
//   {
//     id: "m2",
//     name: "Спайс в лососе",
//     description: "Рис, лосось, соус спайс",
//     price: 3.99,
//   },
//   {
//     id: "m3",
//     name: "Суши с угрем",
//     description: "Угорь копченый, соус унаги, кунжут",
//     price: 4.99,
//   },
//   {
//     id: "m4",
//     name: 'Салат "Поке с лососем"',
//     description:
//       "Рис, лосось, огурец, чука, нори, стружка тунца, соус ореховый",
//     price: 7.99,
//   },
// ];

const MealList = () => {
    const [meals, setMeals] = useState([]);
    const [isLoadMeals, setIsLoadMeals] = useState(false);
    const [httpErrorMessage, setHttpErrorMessage] = useState("");
    useEffect(() => {
        setIsLoadMeals(true);

        const fetchMeals = async () => {
            const response = await fetch(
                "https://react-course-http-30914-default-rtdb.firebaseio.com/meals.json"
            );
            if (!response.ok) {
                throw new Error(
                    "Что-то пошло не так, попробуйте перезагрузить страницу."
                );
            }
            const data = await response.json();

            const loadedMeals = [];
            for (const key in data) {
                loadedMeals.push({
                    id: key,
                    name: data[key].name,
                    description: data[key].description,
                    price: data[key].price,
                });
            }
            setMeals(loadedMeals);
            setIsLoadMeals(false);
        };

        fetchMeals().catch((error) => {
            setIsLoadMeals(false);
            setHttpErrorMessage(error.message);
        });
    }, []);

    if (isLoadMeals) {
        return (
            <section className={styles.loading}>
                <p>Загрузка данных с сервера...</p>
            </section>
        );
    }
    if (httpErrorMessage) {
        return (
            <section className={styles.error}>
                <p>{httpErrorMessage}</p>
            </section>
        );
    }
    const mealList = meals.map((meal) => (
        <MealItem
            key={meal.id}
            id={meal.id}
            name={meal.name}
            description={meal.description}
            price={meal.price}
        />
    ));

    return (
        <section className={styles.meals}>
            <Card>
                <ul>{mealList}</ul>
            </Card>
        </section>
    );
};

export default MealList;
