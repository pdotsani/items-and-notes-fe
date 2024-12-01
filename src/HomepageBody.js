import React, { useState, useEffect } from 'react';
import axios from 'axios';

import body from './config';

import './homepage.css';

const BASE_URL = 'https://notes-and-items-api.uc.r.appspot.com';

function HomepageBody({ user }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [muscles, setMuscles] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    fetchNotes();
  }, [user]);

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

  const handleClearNote = () => {
    setPatient("");
    setMuscles("");
    setBodyPart("");
  };

  const handleAddNote = () => {
    setLoading(true);
    axios.post(`${BASE_URL}/saveNote`, {
      owner: user.uid,
      patient: patient,
      muscles: muscles,
      bodyPart: bodyPart,
      memo: memo
    })
      .then(() => {
        handleClearNote();
        setLoading(false);
      })
      .catch(error => {
        console.error("Error adding note:", error);
        setLoading(false);
      });
  };

  return (
    <div>
      <form className='items-form'>
        <label>
          Patient Name
          <input type="text" name="patient" value={patient} onChange={(e) => setPatient(e.target.value)} />
        </label>
        
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
        <button className="button" onClick={handleAddNote}>Add Note</button>
      </div>
      <div className="items-form">
        {loading ? <h3>Loading...</h3> : notes.map((note, index) => {
          return (
            <div className="item" key={`${note.patient}-` + index}>
              <h3>Patient: {note.patient}</h3>
              <p><strong>Summary:</strong> {note.summary}</p>
              <p><strong>Follow-Up:</strong> {note.followUp}</p>
            </div>
            );
        })}
      </div>
    </div>
  );
}

export default HomepageBody;
