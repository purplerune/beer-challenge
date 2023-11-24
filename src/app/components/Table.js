"use client";

import { Button, Table as MantineTable, Menu, Rating } from "@mantine/core";
import { IconSortAscending2, IconSortDescending2 } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import { ENDPOINT } from "../utils/constants";
import { compareDates } from "../utils/dateHelpers";
import AddBeerForm from "./AddBeerForm";
import BeerModal from "./BeerModal";

const DEFAULT_TABLE_DATA = {
  head: ["Name", "Tagline", "First Brewed", "ABV", "Rating", "Link"],
  body: [],
};

const ITEMS_PER_PAGE = 10;

const Table = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [beerId, setBeerId] = useState(null);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState([]);
  const [sorting, setSorting] = useState({
    name: "asc",
    tagline: "asc",
    first_brewed: "asc",
    abv: "asc",
  });
  const endOffset = itemOffset + ITEMS_PER_PAGE;
  const pageCount = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleCloseFormModal = () => {
    setFormOpen(false);
  };

  useEffect(() => {
    setCurrentItems(
      data
        .sort((a, b) => {
          const column = Object.keys(sorting).find(
            (key) => sorting[key] !== ""
          );
          if (column === "first_brewed") {
            return compareDates(a[column], b[column], sorting?.first_brewed);
          }

          if (column === "abv") {
            return sorting.abv === "asc"
              ? a[column] - b[column]
              : b[column] - a[column];
          }

          return sorting[column] === "asc"
            ? a[column].localeCompare(b[column])
            : b[column].localeCompare(a[column]);
        })
        .slice(itemOffset, endOffset)
    );
  }, [data, sorting, itemOffset, endOffset]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * ITEMS_PER_PAGE) % data.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  //to avoid anonymous functions in order to improve performance
  const handleOpenFormBeer = () => setFormOpen(true);

  const handleChangeSorting = (column) => {
    setSorting((currVal) => ({
      ...Object.fromEntries(Object.keys(currVal).map((key) => [key, ""])),
      [column]: currVal[column] === "asc" ? "desc" : "asc",
    }));
  };
  const onClose = () => setOpened(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${ENDPOINT}/beer`);
      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const parsedData = await res.json();
      setData(parsedData);
    };

    fetchData();
  }, []);

  const tableData = useMemo(() => {
    if (!data || data.length === 0) return DEFAULT_TABLE_DATA;

    return {
      ...DEFAULT_TABLE_DATA,

      head: [
        <div
          key="name"
          className="flex flex-row mr-1 items-center justify-between"
          onClick={() => handleChangeSorting("name")}
        >
          Name
          {sorting.name === "asc" ? (
            <IconSortAscending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          ) : (
            <IconSortDescending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          )}
        </div>,
        <div
          key="Tagline"
          className="flex flex-row mr-1 items-center justify-between"
          onClick={() => handleChangeSorting("tagline")}
        >
          Tagline
          {sorting.tagline === "asc" ? (
            <IconSortAscending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          ) : (
            <IconSortDescending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          )}
        </div>,
        <div
          key="first_brewed"
          className="flex flex-row mr-1 items-center justify-betweenwhitespace-nowrap"
          onClick={() => handleChangeSorting("first_brewed")}
        >
          First Brewed
          {sorting.first_brewed === "asc" ? (
            <IconSortAscending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          ) : (
            <IconSortDescending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          )}
        </div>,
        <div
          key="abv"
          className="flex flex-row mr-1 items-center justify-between"
          onClick={() => handleChangeSorting("abv")}
        >
          ABV
          {sorting.abv === "asc" ? (
            <IconSortAscending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          ) : (
            <IconSortDescending2
              style={{ width: "22px", height: "22px" }}
              stroke={1.5}
            />
          )}
        </div>,
        "Rating",
        "Link",
      ],
      body: currentItems
        .filter((beer) =>
          beer.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((beer) => [
          <div key={beer.id} className="oneLine">
            {beer.name}
          </div>,
          <div key={beer.id} className="oneLine">
            {beer.tagline}
          </div>,
          <div key={beer.id} className="oneLine">
            {beer.first_brewed.match(/[0-9]{2}\/[0-9]{4}/gi)
              ? beer.first_brewed
              : new Intl.DateTimeFormat("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                }).format(new Date(beer.first_brewed))}
          </div>,
          <div key={beer.id} className="oneLine">
            {beer.abv}
          </div>,

          <Rating key={beer?.id} value={beer?.rating} readOnly />,
          <>
            <Menu>
              <Menu.Target>
                <Button>Beer Details</Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Link key={beer.id} href={`/beer/${beer.id}`}>
                  <Menu.Item>Open in Page</Menu.Item>
                </Link>
                <Menu.Item
                  onClick={() => {
                    setBeerId(beer.id);
                    setOpened(true);
                  }}
                >
                  Open in Dialog
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>,
        ]),
    };
  }, [
    currentItems,
    data,
    search,
    sorting.first_brewed,
    sorting.name,
    sorting.tagline,
    sorting.abv,
  ]);

  return (
    <div className="w-full">
      <AddBeerForm opened={formOpen} onClose={handleCloseFormModal} />
      <div className="flex flex-row justify-between items-center mb-4">
        <input
          className="mt-1 rounded-md border border-solid border-black shadow-sm sm:text-sm"
          value={search}
          onChange={() => setSearch(event.target.value)}
          placeholder="Search here..."
        />
        <div>
          <Button onClick={handleOpenFormBeer} className="mr-2">
            Add a beer
          </Button>
          <Link href="/tanstack-beer-table">
            <Button variant="outline" color="yellow">
              See Tanstack version
            </Button>
          </Link>
        </div>
      </div>
      <MantineTable
        data={tableData}
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        withRowBorders
      />
      <ReactPaginate
        breakLabel="..."
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        previousLabel="<"
        nextLabel=">"
        containerClassName="flex justify-center gap-1 text-xs font-medium mt-4"
        pageClassName="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
        previousClassName="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
        nextClassName="block h-8 w-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900"
        activeClassName="block h-8 w-8 rounded !border-blue-600 !bg-blue-600 text-center leading-8 !text-white"
        pageLinkClassName="w-full h-full block"
      />
      <BeerModal opened={opened} onClose={onClose} beerId={beerId} />
    </div>
  );
};

export default Table;
