import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export const List = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [numberOfUsers, setNumberOfUsers] = useState(null);
  const [, setSelectedItem] = useState("All");

  const letters = [];

  const filterUsers = (item) => {
    setSelectedItem(item);
    if (item !== "All") {
      const users = filteredUsers.filter(
        (user) => user.lastName.charAt(0) === item
      );
      setFilteredUsers(users);
    } else {
      filterRegisteredUsers();
    }
  };

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    getNumberOfUsers();
  }, []);

  function getNumberOfUsers() {
    axios
      .get(`https://dlc.org.pl/app/F6QfbuW3jG9WMfX3aQRr/users.php?number=all`)
      .then(function (res) {
        if (Array.isArray(res.data)) {
          setNumberOfUsers(res.data.length);
        }
      });
  }

  const numberQuery = useQuery({
    queryKey: ["number"],
    queryFn: async () => {
      const res = await axios.get(
        `https://dlc.org.pl/app/F6QfbuW3jG9WMfX3aQRr/users.php?registered`
      );
      if (Array.isArray(res.data)) {
        return res.data.length;
      } else {
        return 0;
      }
    },
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Użyj async/await, aby obsłużyć zapytanie asynchronicznie
      try {
        const response = await axios.get(
          "https://dlc.org.pl/app/F6QfbuW3jG9WMfX3aQRr/users.php?number=all"
        );
        if (Array.isArray(response.data)) {
          const sortedUsers = response.data.sort((a, b) =>
            a.lastName.localeCompare(b.lastName)
          );
          return sortedUsers;
        }
      } catch (error) {
        console.error("Błąd podczas zapytania:", error);
      }
      // Upewnij się, że zawsze zwracasz jakąś wartość, nawet jeśli zapytanie się nie powiodło
      return []; // Zwracamy pustą tablicę w przypadku błędu
    },
  });

  const filterRegisteredUsers = () => {
    const registeredOrNot = usersQuery?.data?.filter((user) => {
      const isCheckedAsBool = user.registered[0] === "-" ? false : true;
      return isCheckedAsBool === isChecked;
    });
    setFilteredUsers(registeredOrNot);
  };

  useEffect(() => {
    filterRegisteredUsers();
  }, [isChecked, usersQuery.data]);

  if (usersQuery.data && usersQuery.data.length > 0) {
    usersQuery.data.forEach((user) => {
      const firstLetter = user.lastName.charAt(0);
      if (!letters.includes(firstLetter)) {
        letters.push(firstLetter);
      }
      if (letters.length > 0 && !letters.includes("All")) {
        letters.unshift("All");
      }
    });
  }

  if (numberQuery.isLoading || usersQuery.isLoading) {
    return <div>Ładowanie...</div>;
  }

  if (numberQuery.isError || usersQuery.isError) {
    return <div>Wystąpił błąd podczas ładowania danych.</div>;
  }

  return (
    <main>
      <div className="participants-wrapper">
        <h1 className="participants">
          UCZESTNICY {numberQuery.data}/{numberOfUsers}
        </h1>
        <input
          checked={isChecked}
          type="checkbox"
          className="input"
          onChange={handleChange}
        />
      </div>
      {letters.map((letter) => (
        <button
          className="button"
          key={letter}
          onClick={() => filterUsers(letter)}
        >
          {letter}
        </button>
      ))}
      <div>
        {filteredUsers &&
          filteredUsers.map((user) => (
            <div key={user.identyfikator} className="users">
              <div className="name">{user.imie + " " + user.lastName}</div>
              <input
                type="checkbox"
                className="input"
                checked={isChecked}
                readOnly
              />
            </div>
          ))}
      </div>
    </main>
  );
};
