import { Button } from "@/components/Button";
import { X, Upload, Loader } from "lucide-react";

export function PopUpDialog({ newProposal, setNewProposal, handleFileChange, addProposal, closeDialog, loading, submitted }) {
    return (
      <>
        <div
          className="fixed items-center justify-center flex inset-0 z-[9999] bg-black/30 backdrop-blur-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:delay-200 data-[state=closed]:delay-200"
          onClick={closeDialog}
        >
  
          <div className="bg-white p-5 rounded-lg shadow-lg w-100 md:w-150" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end">
              <button onClick={closeDialog}>
                <X size={24} className="text-gray-700 cursor-pointer" />
              </button>
            </div>
            <h3 className="text-lg font-semibold mb-2">Submit a Proposal</h3><br />
  
            {/* Input Fields */}
            <input
              type="text"
              className={`w-full p-2 border rounded mb-5 ${submitted && !newProposal.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Proposal Title*"
              value={newProposal.title}
              onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
            />
            <textarea
              className={`w-full p-2 border rounded mb-5 ${submitted && !newProposal.description ? 'border-red-500' : 'border-gray-300'}`}
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
                <div className="w-full flex items-center justify-between p-2 border rounded bg-gray-100 dark:bg-gray-700 mb-5">
                  <span className="truncate">{newProposal.file.name}</span>
                  <X size={18} className="text-red-500 cursor-pointer" onClick={() => setNewProposal({ ...newProposal, file: null })} />
                </div>
              ) : (
                <label
                  htmlFor="fileUpload"
                  className={`w-full flex items-center justify-center p-3 border rounded cursor-pointer ${submitted && !newProposal.file ? 'border-red-500 bg-red-100' : 'border-gray-300 bg-gray-100'
                    } transition mb-3`}
                >
                  {loading ? <Loader className="animate-spin mr-2" /> : <Upload className="mr-2" />}
                  {loading ? "Uploading..." : "Upload Proposal"}
                </label>
              )}
  
            </div>
  
            <Button className="w-full bg-blue-500 text-white px-4 py-2 rounded" onClick={addProposal}>
              Submit Proposal
            </Button>
          </div>
        </div>
      </>
    );
  }