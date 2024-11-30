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
  //Added state for storing responses from OpenAI
  const [responses, setResponses] = useState([]);

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
    setItems([...items, { bodyPart, muscles, memo }]);
    setBodyPart("");
    setMuscles("");
    setMemo("");
  };

  const handleClearItems = () => {
    setItems([]);
    //Clear responses when clearing items
    setResponses([]);
  };

  const handleSummarizeItems = () => {
    setLoading(true);
    axios.post(`${BASE_URL}/summarizeNotes`, [...items])
      .then(response => {
        const summaries = response.data;

        // Send summaries to generate treatment plans
        axios.post(`${BASE_URL}/postTreatmentPlan`, summaries.join("\n"))
          .then(planResponse => {
            const plans = planResponse.data.split("\n");
            const combinedResponses = summaries.map((summary, index) => ({
              summary,
              treatmentPlan: plans[index] || "No treatment plan generated.",
            }));
            //Save and combine responses
            setResponses(combinedResponses);
            setLoading(false);
          })
          .catch(error => {
            console.error("Error generating treatment plans:", error);
            setLoading(false);
          });
      })
      .catch(error => {
        console.error("Error summarizing items:", error);
        setLoading(false);
      });
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
        <button className="button" onClick={handleClearItems}>Clear Items</button> {/*clear responses */}
      </div>
      <div className="items">
        {
          items.map((item, index) => {
            return (
              <div key={"item-" + item.bodyPart + item.muscles + item.memo} className="item">
                <h3>{item.bodyPart}</h3>
                <p>{item.muscles}</p>
                <p>"{item.memo}"</p>

                // Display responses
                {responses[index] && (
                  <div>
                    <p><strong>Summary:</strong> {responses[index].summary}</p>
                    <p><strong>Treatment Plan:</strong> {responses[index].treatmentPlan}</p>
                  </div>
                )}
              </div>
            );
          })
        }
      </div>
      {items.length > 0 && <div className="button-container">
        <button className="button" onClick={handleSummarizeItems} disabled={loading}>Summarize Items</button> {/* **Calls the enhanced function** */}
      </div>}
      <div className="notes">
        {loading && <h2>Loading...</h2>}
        {
          notes.map(note => {
            return (
              <div key={"note-" + note.id} className="note">
                <div>{note.patient}</div>
                <div>{note.note}</div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default HomepageBody;
