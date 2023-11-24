import { Button, TextInput, Modal, Rating, Title } from "@mantine/core";
import { useState } from "react";
import { ENDPOINT } from "../utils/constants";

const AddBeerForm = ({ opened, onClose }) => {
  const [beerData, setBeerData] = useState({
    name: "",
    tagline: "",
    first_brewed: "",
    abv: "",
    rating: 0,
    comment: "",
    note: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBeerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeRating = (value) => {
    setBeerData((prevData) => ({
      ...prevData,
      rating: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add beer to database
    fetch(`${ENDPOINT}/beer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(beerData),
    })
      .then(async () => {
        setBeerData({
          name: "",
          tagline: "",
          first_brewed: "",
          abv: "",
          rating: 0,
          comment: "",
          note: "",
        });

        setTimeout(() => {
          alert("Beer added!");
          onClose();
        }, 200);
      })
      .catch((err) => {
        alert(
          "There was an error trying to add the beer. Please try again!",
          err
        );
      });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add a Beer"
      size="xl"
      padding="md"
    >
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
        type="date"
        value={beerData.first_brewed}
        onChange={handleChange}
      />
      <TextInput
        name="abv"
        label="ABV"
        value={beerData.abv}
        onChange={handleChange}
      />
      <hr />
      <div className="items-center flex flex-col">
        <label>Rating</label>
        <Rating value={beerData.rating} onChange={handleChangeRating} />
      </div>
      <TextInput
        name="comment"
        label="Comment"
        value={beerData.comment}
        onChange={handleChange}
      />
      <TextInput
        name="note"
        label="Note"
        type="textarea"
        value={beerData.note}
        onChange={handleChange}
      />
      <Button className="mt-4" onClick={handleSubmit}>
        Add Beer
      </Button>
    </Modal>
  );
};

export default AddBeerForm;
