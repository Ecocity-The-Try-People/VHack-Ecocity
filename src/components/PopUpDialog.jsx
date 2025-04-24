import { Button } from "@/components/Button";
import { Upload, Loader, X } from "lucide-react";
import { useState } from "react";

export function PopUpDialog({
  newProposal,
  setNewProposal,
  addProposal,
  closeDialog,
  loading,
  submitted,
}) {
  const [fileUploading, setFileUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type (allow images and PDFs)
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload only PNG, JPG, or PDF files');
      return;
    }

    // Check file size (limit to 2MB for base64)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size too large (max 2MB)');
      return;
    }

    setFileUploading(true);

    try {
      const base64String = await convertToBase64(file);
      setNewProposal({
        ...newProposal,
        file: base64String,
        fileName: file.name,
        fileType: file.type
      });
    } catch (error) {
      console.error("Error converting file:", error);
      alert("Error processing file");
    } finally {
      setFileUploading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-xs flex items-center justify-center"
      onClick={closeDialog}
    >
      <div
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Submit a Proposal</h3>
          <button 
            onClick={closeDialog}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close dialog"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            className={`w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              submitted && !newProposal.title ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="Proposal Title*"
            value={newProposal.title}
            onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
          />
          
          <textarea
            className={`w-full p-3 border rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              submitted && !newProposal.description ? "border-red-500" : "border-gray-600"
            }`}
            placeholder="Proposal Description*"
            value={newProposal.description}
            onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
            rows={4}
          />

          <div className="border border-dashed border-gray-600 rounded-lg p-4">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, application/pdf"
            />
            <label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition ${
                fileUploading ? "bg-gray-700" : "bg-gray-700 hover:bg-gray-600"
              } ${
                submitted && !newProposal.file ? "border border-red-500" : ""
              }`}
            >
              {fileUploading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 text-blue-500 mb-2" />
                  <span>Uploading file...</span>
                </>
              ) : newProposal.file ? (
                <div className="flex items-center justify-between w-full">
                  <span className="truncate text-gray-300">{newProposal.fileName}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setNewProposal({ ...newProposal, file: null, fileName: null, fileType: null });
                    }}
                    className="text-red-500 hover:text-red-400 p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-gray-400 mb-2" />
                  <span className="text-center">
                    <span className="text-blue-400">Click to upload</span> or drag and drop
                    <br />
                    <span className="text-sm text-gray-400">(PNG, JPG, PDF up to 2MB)</span>
                  </span>
                </>
              )}
            </label>
          </div>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            onClick={addProposal}
            disabled={loading || fileUploading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Submitting...
              </span>
            ) : (
              'Submit Proposal'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}