import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import { getDate } from './dateService';

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
    setMemo("");
  };

  const handleAddNote = useCallback(() => {
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
        fetchNotes();
        setLoading(false);
      })
      .catch(error => {
        console.error("Error adding note:", error);
        setLoading(false);
      });
  },[user, patient, muscles, bodyPart, memo]);

  const handleCopySummary = async (e) => {
    const pTag = e.target.closest('p');
    const textToCopy = pTag.querySelector('.summary-content').textContent;
    await navigator.clipboard.writeText(textToCopy);
  };

  const handleCopyFollowUp = async (e) => {
    const pTag = e.target.closest('p');
    const textToCopy = pTag.querySelector('.follow-up-content').textContent;
    await navigator.clipboard.writeText(textToCopy);
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
      <h2 className='notes-header'>Notes</h2>
      <div className="note-list">
        {loading ? <h3>Loading...</h3> : notes.map((note, index) => {
          return (
            <div className="note" key={`${note.patient}-` + index}>
              <h3 className='note-patient'>{note.patient}</h3>
              <h3 className='note-date'>{getDate(note.date)}</h3>
              <p><strong>Summary:</strong> <span className='summary-content'>{note.summary}</span> <span className='copy-button' onClick={handleCopySummary}>| copy summary |</span></p>
              <p><strong>Follow-Up:</strong> <span className='follow-up-content'>{note.followUp}</span> <span className='copy-button' onClick={handleCopyFollowUp}>| copy follow-up |</span></p>
            </div>
            );
        })}
      </div>
    </div>
  );
}

export default HomepageBody;
