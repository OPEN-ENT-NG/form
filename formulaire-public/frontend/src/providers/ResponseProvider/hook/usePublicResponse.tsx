export const usePublicResponse = () => {
  // eslint-disable-next-line @typescript-eslint/require-await
  const saveResponses = async () => {
    //TODO implement save logic here and remove linter disabler
    //TODO update storage here
    console.log("saving response for public mode !");
    return;
  };

  return {
    saveClassicResponses: saveResponses,
  };
};
