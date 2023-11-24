"use client";

import { Fieldset, Modal, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { ENDPOINT } from "../utils/constants";

const BeerModal = ({ opened, onClose, beerId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!beerId) return;

    const fetchData = async () => {
      const res = await fetch(`${ENDPOINT}/beer/${beerId}`);
      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const parsedData = await res.json();
      setData(parsedData);
    };

    fetchData();
  }, [beerId]);

  useEffect(() => {
    if (!opened) setData(null);
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Beer Information"
      size="xl"
      padding="xl"
    >
      <Fieldset legend="General information">
        <TextInput disabled label="Name" defaultValue={data?.name || ""} />
        <TextInput
          disabled
          label="Tagline"
          defaultValue={data?.tagline || ""}
        />
      </Fieldset>
    </Modal>
  );
};

export default BeerModal;
