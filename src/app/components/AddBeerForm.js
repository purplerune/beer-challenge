import { Button, TextInput } from "@mantine/core";
import { useState } from "react";

const AddBeerForm = () => {
  const [beerData, setBeerData] = useState({
    name: "",
    tagline: "",
    first_brewed: "",
    abv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add beer to database
  
    const res = fetch("https://656088c983aba11d99d104f6.mockapi.io/beer", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(beerData)
    }).then(async (res) => {
      console.log('Beer added!', await res.json());
      setBeerData({
        name: "",
        tagline: "",
        first_brewed: "",
        abv: "",
      });
    }).catch((err ) => {
      alert('There was an error trying to add the beer. Please try again!')
    })
    

    

  };

  return (
    <div>
      <Button onClick={handleSubmit}>Add Beer</Button>
      <TextInput
        name="name"
        label="Name"
        value={beerData.name}
        onChange={handleChange}
      />
      <TextInput
        name="tagline"
        label="Tagline"
        value={beerData.tagline}
        onChange={handleChange}
      />
      <TextInput
        name="first_brewed"
        label="First Brewed"
        value={beerData.first_brewed}
        onChange={handleChange}
      />
      <TextInput
        name="abv"
        label="ABV"
        value={beerData.abv}
        onChange={handleChange}
      />
    </div>
  );
};

export default AddBeerForm;
