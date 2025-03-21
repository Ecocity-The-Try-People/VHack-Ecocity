import { Button } from "@/components/Button";
import { X, Upload, Loader } from "lucide-react";

export function PopUpDialog({
  newProposal,
  setNewProposal,
  handleFileChange,
  addProposal,
  closeDialog,
  loading,
  submitted,
}) {
  return (
    <>
      <div
        className="fixed items-center justify-center flex inset-0 z-[9999] bg-black/30 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:delay-200 data-[state=closed]:delay-200"
        onClick={closeDialog}
      >
        <div
          className="bg-gray-800 p-5 rounded-lg shadow-lg w-100 md:w-150 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end">
            <button onClick={closeDialog}>
              <X size={24} className="text-gray-300 hover:text-gray-100 cursor-pointer" />
            </button>
          </div>
          <h3 className="text-lg font-semibold mb-2">Submit a Proposal</h3>
          <br />

          {/* Input Fields */}
          <input
            type="text"
            className={`w-full p-2 border rounded mb-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${submitted && !newProposal.title ? "border-red-500" : "border-gray-600"
              }`}
            placeholder="Proposal Title*"
            value={newProposal.title}
            onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
          />
          <textarea
            className={`w-full p-2 border rounded mb-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${submitted && !newProposal.description ? "border-red-500" : "border-gray-600"
              }`}
            placeholder="Proposal Description*"
            value={newProposal.description}
            onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
          />
          <div className="w-full">
            <input
              type="file"
              id="fileUpload"
              className="hidden"
              onChange={handleFileChange}
            />

            {newProposal.file ? (
              <div className="w-full flex items-center justify-between p-2 border rounded bg-gray-700 mb-5">
                <span className="truncate text-gray-300">{newProposal.file.name}</span>
                <X
                  size={18}
                  className="text-red-500 cursor-pointer hover:text-red-400"
                  onClick={() => setNewProposal({ ...newProposal, file: null })}
                />
              </div>
            ) : (
              <label
                htmlFor="fileUpload"
                className={`w-full flex items-center justify-center p-3 border rounded cursor-pointer bg-gray-700 text-gray-300 hover:bg-gray-600 transition mb-3 ${submitted && !newProposal.file ? "border-red-500" : "border-gray-600"
                  }`}
              >
                {loading ? <Loader className="animate-spin mr-2" /> : <Upload className="mr-2" />}
                {loading ? "Uploading..." : "Upload Proposal"}
              </label>
            )}
          </div>

          <Button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={addProposal}
          >
            Submit Proposal
          </Button>
        </div>
      </div>
    </>
  );
}