"use client";
const scrollToTop = () => {
  try {
    if (document.querySelector("body")) {
      document.querySelector("body")?.scrollIntoView(true);
    }
  } catch (error) {
    // console.log(error);
  }
  return <></>;
};

export default scrollToTop;
