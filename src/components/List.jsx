// import axios from "axios";
import { useState, useEffect } from 'react';
// import { useQuery } from "@tanstack/react-query";

export const List = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos'
        );
        const data = await response.json();

        // Ogranicz do pierwszych 4 elementów
        const firstFourItems = data.slice(0, 4);

        const usersWithDetails = await Promise.all(
          firstFourItems.map(async (todo) => {
            const userDetailsResponse = await fetch(
              `https://jsonplaceholder.typicode.com/posts/${todo.id}`
            );
            const userDetails = await userDetailsResponse.json();
            return { ...todo, details: userDetails };
          })
        );

        setData(usersWithDetails);
        // setData(firstFourItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      {data.map((item) => (
        <div key={item.id}>
          {item.id}
          {item.details.title}
        </div>
      ))}
    </main>
  );
};
