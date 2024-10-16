export const lastUrlParam = (window) =>
  window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return (txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
      .replace(/-/gm, ' ')
      .replace(/_/gm, ' ');
  });
};
