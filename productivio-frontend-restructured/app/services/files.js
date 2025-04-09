//Sends file as FormData to backend via fetch
// app/services/files.js

export const uploadFileToServer = async (file, taskId) => {
    try {
    //FormData allows to send binary file data (like images or PDFs) through HTTP
    //It mimics how a regular <form enctype="multipart/form-data"> would behave
      const formData = new FormData();
      formData.append("file", file);
      formData.append("taskId", taskId); // Include taskId in the payload
  
      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
      return { success: false, error: error.message };
    }
  };
  

// Download file from Cloudflare
// app/services/files.js
export const downloadFileFromServer = async (key) => {
    try {
      const res = await fetch(`/api/files/upload?key=${encodeURIComponent(key)}`);
      const data = await res.json();
  
      if (!data.success) throw new Error(data.error);
  
      // Create an anchor element
      const link = document.createElement("a");
      link.href = data.url;
  
      // Extract filename from key
      const fileName = key.split("/").pop();
      link.download = fileName; // This forces download with correct name
  
      link.target = "_blank"; // Optional: open in new tab if download fails
  
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      return { success: true };
    } catch (error) {
      console.error("Error downloading file:", error);
      return { success: false, error: error.message };
    }
  };
  
  
  
  
// Delete file from Cloudflare
export const deleteFileFromServer = async (key, taskId) => {
    //console.log("Deleting with:", { key, taskId });
    try {
      const res = await fetch("/api/files/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, taskId }), // Send both key and taskId
      });
  
      return await res.json();
    } catch (error) {
      console.error("Error deleting file:", error);
      return { success: false, error: error.message };
    }
  };
  