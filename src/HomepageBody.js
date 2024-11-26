import React, { useState, useEffect } from 'react';
import axios from 'axios';

import body from './config';

const BASE_URL = 'https://notes-and-items-api.uc.r.appspot.com';

function HomepageBody({ user }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [bodyPart, setBodyPart] = useState("");
  const [muscles, setMuscles] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    axios.get(`${BASE_URL}/getNotes?owner=${user.uid}`)
      .then(response => {
        setNotes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [user.uid]);

  const handleAddItem = () => {
    setItems([...items, { bodyPart , muscles, memo }]);
    setBodyPart("");
    setMuscles("");
    setMemo("");
  };

  const handleClearItems = () => {
    setItems([]);
  };

  const handleSummarizeItems = () => {
    setLoading(true);
    axios.post(`${BASE_URL}/summarizeNotes`, [...items])
      .then(response => {
        console.log(response.data);
        // setNotes([...notes, ...response.data]);
        // Run save note api here
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <form>
        <label>
          Body Part
          <select name="bodyPart" onChange={(e) => setBodyPart(e.target.value)}>
            <option value="">Select Body Part</option>
            {
              Object.keys(body).map(bodyPart => {
                return (
                  <option key={bodyPart} value={bodyPart}>{bodyPart}</option>
                );
              })
            }
          </select>
        </label>
        {bodyPart && <label>
          Muscle
          <select name="muscles" onChange={(e) => setMuscles(e.target.value)}>
            <option value="">Select Muscle</option>
            {
              body[bodyPart].map(muscle => {
                return (
                  <option key={muscle} value={muscle}>{muscle}</option>
                );
              })
            }
          </select>
        </label>}
        {bodyPart && muscles && <label>
          memo
          <input type="text" name="memo" onChange={(e) => setMemo(e.target.value)} />
        </label>}
      </form>
      <button onClick={handleAddItem}>Add Item</button>
      {items.length > 0 && <button onClick={handleSummarizeItems} disabled={loading}>Summarize Items</button>}
      <button onClick={handleClearItems}>Clear Items</button>
      <div className="items">
        {
          items.map(item => {
            return (
              <div key={"item-" + item.bodyPart + item.muscles + item.memo} className="item">
                <h2>{item.bodyPart}</h2>
                <p>{item.muscles}</p>
                <p>{item.memo}</p>
              </div>
            );
          })
        }
      </div>
      <div className="notes">
        {loading && <h2>Loading...</h2>}
        {
          notes.map(note => {
            return (
              <div key={"note-" + note.id} className="note">
                <h2>{note.patient}</h2>
                <p>{note.note}</p>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default HomepageBody;
