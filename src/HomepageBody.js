import React, { useState, useEffect } from 'react';
import axios from 'axios';

import body from './config';

import './homepage.css';

const BASE_URL = 'https://notes-and-items-api.uc.r.appspot.com';

function HomepageBody({ user }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [bodyPart, setBodyPart] = useState("");
  const [muscles, setMuscles] = useState("");
  const [memo, setMemo] = useState("");
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, [user.uid]);

  const fetchNotes = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/getNotes?owner=${user.uid}`)
      .then(response => {
        setNotes(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  const handleAddItem = () => {
    setItems([...items, { bodyPart, muscles, memo }]);
    setBodyPart("");
    setMuscles("");
    setMemo("");
  };

  const handleClearItems = () => {
    setItems([]);
    setResponses([]);
  };

  const handleSaveNotes = () => {
    setLoading(true);
    const savePromises = items.map(item => {
      const notePayload = {
        owner: user.uid,
        patient: "John Smith",
        item: item
      };
      return axios.post(`${BASE_URL}/saveNotes`, notePayload);
    });

    Promise.all(savePromises)
      .then(() => {
        setItems([]);
        fetchNotes();
      })
      .catch(error => {
        console.error("Error saving notes:", error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <form className='items-form'>
        <label>
          Body Part
          <select name="bodyPart" value={bodyPart} onChange={(e) => setBodyPart(e.target.value)}>
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
          <select name="muscles" value={muscles} onChange={(e) => setMuscles(e.target.value)}>
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
          Memo
          <textarea name="memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
        </label>}
      </form>
      <div className="button-container">
        <button className="button" onClick={handleAddItem}>Add Item</button>
        <button className="button" onClick={handleClearItems}>Clear Items</button> {/* Button to clear */}
      </div>
      <div className="items">
        {
          items.map((item, index) => {
            return (
              <div key={"item-" + item.bodyPart + item.muscles + item.memo} className="item">
                <h3>{item.bodyPart}</h3>
                <p>{item.muscles}</p>
                <p>"{item.memo}"</p>

            );
          })
        }
      </div>
      {items.length > 0 && <div className="button-container">
        <button className="button" onClick={handleSaveNotes} disabled={loading}>Save Notes</button> {/* Altered button to save notes */}
      </div>}
      <div className="notes">
        {loading && <h2>Loading...</h2>} {/* Load */}
        {
          notes.map(note => {
            return ( // Display
              <div key={"note-" + note.id} className="note">
                <h3>Patient: {note.patient}</h3>
                <p><strong>Summary:</strong> {note.summary}</p>
                <p><strong>Follow-Up:</strong> {note.followUp}</p>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default HomepageBody;
