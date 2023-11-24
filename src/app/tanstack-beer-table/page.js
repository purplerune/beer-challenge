"use client";

import { useMemo, useState, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { OLD_ENDPOINT } from "../utils/constants";

const TanStackBeerTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${OLD_ENDPOINT}/beers`);
      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const parsedData = await res.json();
      setData(parsedData);
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "tagline",
        header: "Tagline",
      },
      {
        accessorKey: "first_brewed",
        header: "First Brewed in",
      },
      {
        accessorKey: "abv",
        header: "ABV",
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data,
  });

  return (
    <main className="p-24">
      <MantineReactTable table={table} />
    </main>
  );
};

export default TanStackBeerTable;
