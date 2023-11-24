export const compareDates = (d1, d2, sortOrder) => {
    const date1 = d1.match(/[0-9]{2}\/[0-9]{4}/gi)
      ? new Date("01/" + d1).getTime()
      : new Date(d1).getTime();
    const date2 = d2.match(/[0-9]{2}\/[0-9]{4}/gi)
      ? new Date("01/" + d2).getTime()
      : new Date(d2).getTime();
  
    if (date1 < date2) {
      return sortOrder === "asc" ? 1 : -1;
    } else if (date1 > date2) {
      return sortOrder === "asc" ? -1 : 1;
    } else {
      return 0;
    }
  };