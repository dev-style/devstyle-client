import ReactGA from "react-ga4";

export const analyticsEventTracker = (category = "Unknown") => {
  const eventTracker = (action = "Unknown", label = "Unknown") => {
    ReactGA.event({ category, action, label });
  };
  return eventTracker;
};
