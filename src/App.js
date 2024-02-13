import React, { useEffect, useReducer, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Login from "./container/login/Login";
import Tile from "./components/Tile/Tile";
import Button from "./components/Button/Button";
import AddNewForm from "./components/AddNewForm/AddNewForm";
import { getIv, encrypt, decrypt } from "./crypto";

const url = `${window.location.href}data`;

const saveEncryptedKeys = async (newKeyList) => {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newKeyList),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(JSON.stringify(data));
    })
    .catch((err) => console.log("Failed to save encrypted keys"));
};

const encryptedKeysReducer = (state, action) => {
  let keys;
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "ADD":
      const newKeys = [...state, action.payload];
      saveEncryptedKeys(newKeys);
      return newKeys;
    case "DELETE":
      keys = [...state];
      keys.splice(action.payload.index, 1);
      saveEncryptedKeys(keys);
      return keys;
    case "UPDATE":
      keys = [...state].map((item, itemIndex) => {
        if (itemIndex === action.index) {
          return action.payload;
        } else {
          return item;
        }
      });
      saveEncryptedKeys(keys);
      return keys;
    default:
      return state;
  }
};

const keySummaryReducer = (state, action) => {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "ADD":
      return [...state, action.payload];
    case "DELETE":
      const keys = [...state];
      const newKeys = keys.filter(
        (element) => element.name !== action.payload.name
      );
      newKeys.forEach((entry, index) => (entry.index = index));
      return newKeys;

    default:
      return state;
  }
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keyList, updateKeyList] = useReducer(encryptedKeysReducer, []);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [keySummary, updateKeySummary] = useReducer(keySummaryReducer, []);
  const [search, setSearch] = useState("");

  const getKeysSummary = async (key) => {
    const keys = [];
    try {
      for (let index = 0; index < keyList.length; index++) {
        const iv = new Uint8Array(keyList[index].iv);
        const text = keyList[index].text;

        const decText = await decrypt(text, key, iv);
        const { url, name } = JSON.parse(decText);
        keys.push({ url, name, index });
      }
      setIsAuthenticated(true);
      updateKeySummary({ type: "INIT", payload: keys });
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const addNewKeyToEncryptedList = async (item, cryptoKey) => {
    const iv = getIv();
    const text = await encrypt(JSON.stringify(item), cryptoKey, iv);
    updateKeyList({ type: "ADD", payload: { iv: Array.from(iv), text } });
  };

  const updateKeyToEncryptedList = async (index, item, cryptoKey) => {
    const iv = getIv();
    const text = await encrypt(JSON.stringify(item), cryptoKey, iv);
    updateKeyList({
      type: "UPDATE",
      payload: { iv: Array.from(iv), text },
      index,
    });
  };

  const encryptKeyReducer = (state, action) => {
    switch (action.type) {
      case "UPDATE_KEY":
        const newState = { ...state, encryptKey: action.payload };
        getKeysSummary(action.payload);
        return newState;

      default:
        return state;
    }
  };

  const [encryptKey, setEncryptKey] = useReducer(encryptKeyReducer, {});

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          const keysFromFile = res.data;

          if (keysFromFile.length) {
            setIsFirstTime(false);
            updateKeyList({ type: "INIT", payload: keysFromFile });
          }
        }
      })
      .catch((err) => console.log("fetch err" + err));
  }, []);

  const addItemToList = (entry) => {
    const payload = {
      url: entry.addr,
      name: entry.desc,
      content: {
        username: entry.user,
        password: entry.pwd,
        email: entry.email,
        phone: entry.phone,
        misc: entry.misc,
      },
    };

    updateKeySummary({
      type: "ADD",
      payload: {
        url: entry.addr,
        name: entry.desc,
        index: keySummary.length,
      },
    });
    addNewKeyToEncryptedList(payload, encryptKey.encryptKey);
  };

  const updateItemToList = ({ content, name, addr, index }) => {
    const payload = {
      url: addr,
      name: name,
      content: {
        username: content.user,
        password: content.pwd,
        email: content.email,
        phone: content.phone,
        misc: content.misc,
      },
    };
    updateKeyToEncryptedList(index, payload, encryptKey.encryptKey);
  };

  const deleteItemFromList = (entry, index) => {
    updateKeySummary({ type: "DELETE", payload: { name: entry } });
    updateKeyList({ type: "DELETE", payload: { index: index } });
  };

  const getItemContentAtIndex = async (index) => {
    const iv = new Uint8Array(keyList[index].iv);
    const text = keyList[index].text;
    const decText = await decrypt(text, encryptKey.encryptKey, iv);

    const content = JSON.parse(decText).content;

    return content;
  };

  const sLower = search.toLowerCase();
  let filterKeys = keySummary.filter((item) => {
    const itemName = item.name.toLowerCase();
    if (itemName.includes(sLower)) return true;
    else return false;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/add"
          element={
            <AddNewForm
              isAuthenticated={isAuthenticated}
              addItemToList={addItemToList}
            />
          }
        />
        <Route
          path="/"
          element={
            <div>
              <div>
                <h2 align="center">MyKeyApp v2 </h2>
                {isAuthenticated ? (
                  <React.Fragment>
                    <input
                      className="textInput"
                      type="text"
                      width="100%"
                      border="solid"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                    />
                    <Link to="add">
                      <Button name="Add New" />
                    </Link>
                  </React.Fragment>
                ) : null}
              </div>
              {!isAuthenticated ? (
                <Login
                  isFirstTime={isFirstTime}
                  isAuthenticated={isAuthenticated}
                  setEncryptKey={setEncryptKey}
                />
              ) : (
                filterKeys.map((item) => (
                  <Tile
                    url={item.url}
                    name={item.name}
                    key={item.name}
                    index={item.index}
                    delete={deleteItemFromList}
                    content={getItemContentAtIndex}
                    update={updateItemToList}
                  />
                ))
              )}
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
