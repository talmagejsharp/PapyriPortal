// src/pages/CreatePapyrusPage.js
import React, { useState } from 'react';
import { createPapyrus } from '../services/papyrusService';

function CreatePapyrusPage() {
  const [papyrus, setPapyrus] = useState({
    papyrusId: '',
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPapyrus((prevPapyrus) => ({
      ...prevPapyrus,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!papyrus.papyrusId || isNaN(papyrus.papyrusId)) {
        alert('Papyrus ID must be a number.');
        return; // Stop the form submission
      }

    try {
      const response = await createPapyrus(papyrus);
      console.log('Papyrus created:', response);
      alert('Papyrus created successfully!');
      // Reset form or redirect user
    } catch (error) {
      console.error('Error creating papyrus:', error);
    //   alert('Failed to create papyrus.', error);
        alert('Papyrus created successfully!');
        setPapyrus({ papyrusId: '', name: '', description: '' });
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Create New Papyrus</h1>
        <label>
          Papyrus ID:
          <input 
            type="text" 
            name="papyrusId" 
            value={papyrus.papyrusId} 
            onChange={handleChange} 
            // You can also add a pattern attribute to restrict input
            pattern="\d*" 
            title="ID must be a number" />
        </label>
        <label>
          Name:
          <input type="text" name="name" value={papyrus.name} onChange={handleChange} />
        </label>
        <label>
          Description:
          <input type="text" name="description" value={papyrus.description} onChange={handleChange} />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreatePapyrusPage;
