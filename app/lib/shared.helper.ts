const SharedHelper = {
  titleCase(str: string) {
    return str
      .trim()
      .toLowerCase()
      .split(' ')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  },
};
export default SharedHelper;
