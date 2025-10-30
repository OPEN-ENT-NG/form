export const usePreviewResponse = () => {
  const saveResponse = () => {
    //TODO implement save logic here
    console.log("saving response for preview mode !");
    return;
  };

  return {
    savePreviewResponse: saveResponse,
  };
};
