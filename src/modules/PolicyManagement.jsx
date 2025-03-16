import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Reply, X, Upload, Loader } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { useToggle } from "../hooks/useToggle";
import { motion } from "framer-motion";
import { useNotificationContext } from "../context/NotificationContext";

// Sample Proposal Data
const initialProposals = [
  {
    id: 1,
    title: "Traffic Regulation Update",
    description: "Proposal to enforce stricter speed limits in residential areas to reduce accidents.",
    votes: 45,
    file: "",
    comments: [
      {
        text: "This is the first comment.",
        replies: ["First reply!", "Another reply."],
      },
      {
        text: "Here's another comment.",
        replies: [],
      },
    ],
  },
  {
    id: 2,
    title: "Waste Management Reform",
    description: "Introducing a new recycling initiative to promote sustainable waste disposal.",
    votes: 23,
    file: "",
    comments: [
      {
        text: "Great proposal!",
        replies: ["I agree!", "Good point."]
      },
      {
        text: "Needs more details.",
        replies: []
      },
    ],
  },
  {
    id: 3,
    title: "Public Transport Expansion",
    description: "Plan to add new bus routes and optimize existing ones to ease congestion.",
    file: "",
    votes: 8,
    comments: [
      {
        text: "This is the first comment.",
        replies: ["First reply!", "Another reply."],
      },
      {
        text: "Here's another comment.",
        replies: [],
      },
    ],
  },
];

export default function PolicyManagement() {
  const [proposals, setProposals] = useState(initialProposals);
  const [openProposalUpload, setOpenProposalUpload] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: "", description: "", file: null });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { showNotification } = useNotificationContext() || {};
  const [submitted, setSubmitted] = useState(false);

  function openDialog() {
    setOpenProposalUpload(true);
  }

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setLoading(true);
      setTimeout(() => {
        setNewProposal((prev) => ({ ...prev, file: selectedFile }));
        setLoading(false);
      }, 1500);
    }
  }

  function addProposal() {
    setSubmitted(true);
    if (!newProposal.title || !newProposal.description || !newProposal.file) {
      showNotification("Please provide all fields including a document.", "error");
      return;
    }

    setProposals([
      ...proposals,
      {
        id: proposals.length + 1,
        title: newProposal.title,
        description: newProposal.description,
        file: newProposal.file,
        votes: 0,
        comments: [],
      },
    ]);

    showNotification("Proposal submitted successfully!", "success");
    setOpenProposalUpload(false);
    setNewProposal({ title: "", description: "", file: null });
  }

  const filteredProposals = proposals.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="mb-5">
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold mb-2">Policy Proposal & Voting</h2>
            <p className="text-gray-500">Submit new policy proposals, discuss, and vote.</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <Button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={openDialog}>
          Add Proposal
        </Button>
      </div>

      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Search proposals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <FaSearch className="text-gray-500" />
      </div>

      {openProposalUpload && (
        <PopUpDialog
          newProposal={newProposal}
          setNewProposal={setNewProposal}
          handleFileChange={handleFileChange}
          addProposal={addProposal}
          closeDialog={() => setOpenProposalUpload(false)}
          loading={loading}
          submitted={submitted}
        />
      )}

      <Card className="w-full">
        {filteredProposals.map((proposal) => (
          <motion.div key={proposal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProposalCard
              proposal={proposal}
              proposals={proposals}
              setProposals={setProposals}
            />
          </motion.div>
        ))}
      </Card>
    </div>
  );
}

function ProposalCard({ proposal, proposals, setProposals }) {
  const [comment, setComment] = useState("");
  const [commentReply, setCommentReply] = useState({ parentIndex: null, text: "" });
  const [vote, toggleVote] = useToggle();
  const replyInputRef = useRef(null);

  function handleVote() {
    toggleVote();
    setProposals(
      proposals.map((p) =>
        p.id === proposal.id
          ? { ...p, votes: vote ? p.votes - 1 : p.votes + 1 }
          : p
      )
    );
  }

  function addComment() {
    if (comment.trim() === "") return;
    setProposals(
      proposals.map((p) =>
        p.id === proposal.id
          ? { ...p, comments: [...p.comments, { text: comment, replies: [] }] }
          : p
      )
    );
    setComment("");
  }

  function addReply() {
    if (commentReply.text.trim() === "" || commentReply.parentIndex === null) return;

    setProposals(proposals.map((p) => {
      if (p.id === proposal.id) {
        const updatedComments = p.comments.map((c, index) =>
          index === commentReply.parentIndex
            ? { ...c, replies: [...c.replies, commentReply.text.trim()] }
            : c
        );
        return { ...p, comments: updatedComments };
      }
      return p;
    }));
    setCommentReply({ parentIndex: null, text: "" });
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (replyInputRef.current && !replyInputRef.current.contains(event.target)) {
        setCommentReply({ parentIndex: null, text: "" });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-5">
      <CardContent>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="text-xl font-bold mb-2">{proposal.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-3">{proposal.description}</p>

          {proposal.file && (
            <div className="mb-3">
              <span className="font-semibold">Attached File: </span>
              <span className="text-blue-500 underline cursor-pointer" onClick={() => {
                const url = URL.createObjectURL(proposal.file);
                const a = document.createElement("a");
                a.href = url;
                a.download = proposal.file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }}>
                {proposal.file.name || "Download"}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Votes: {proposal.votes}</span>
            <Button className={`${vote ? "bg-red-500" : "bg-green-500"} text-white px-4 py-2 rounded`} onClick={handleVote}>
              {vote ? "Unvote" : "Vote"}
            </Button>
          </div>

          {/* COMMENT SECTION */}
          {/* <div className="mt-4">
            <h4 className="font-semibold mb-2">Discussion</h4>
            <div className="flex">
              <input
                type="text"
                className="flex-1 p-2 border rounded"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button className="ml-2 bg-gray-600 text-white px-3 py-2 rounded flex flex-row gap-2" onClick={addComment}>
                <Reply className="mr-1" size={20} />Comment
              </Button>
            </div>

            <div className="mt-2">
              {proposal.comments.map((c, index) => (
                <div key={index} className="ml-4 border-l-2 pl-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">➤ {c.text}</p>
                  <button
                    className="text-blue-500 text-xs mt-1"
                    onClick={() => setCommentReply({ parentIndex: index, text: "" })}
                  >
                    Reply
                  </button>

                  {commentReply.parentIndex === index && (
                    <div className="mt-1">
                      <input
                        type="text"
                        value={commentReply.text}
                        onChange={(e) => setCommentReply({ ...commentReply, text: e.target.value })}
                        className="border px-2 py-1 text-sm w-full rounded"
                        placeholder="Write a reply..."
                      />
                      <button
                        className="mt-1 bg-blue-500 text-white px-2 py-1 text-xs rounded"
                        onClick={addReply}
                      >
                        Submit
                      </button>
                    </div>
                  )}

                  {c.replies && c.replies.map((reply, rIndex) => (
                    <p key={rIndex} className="ml-4 text-sm text-gray-500 dark:text-gray-400">↳ {reply}</p>
                  ))}
                </div>
              ))}

            </div>
          </div> */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h4 className="font-semibold text-lg mb-3">Discussion</h4>

            {/* Comment Input Section */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition" onClick={addComment}>
                <Reply size={20} /> Comment
              </Button>
            </div>

            {/* Comments Section */}
            <div className="mt-4">
              {
                proposal.comments.map((c, index) => (
                  <div key={index} className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-800 dark:text-gray-200">➤ {c.text}</p>
                    <div className="flex flex-row-reverse">
                      <button
                        className="top-2 right-3 text-blue-500 text-xs hover:underline"
                        onClick={() =>
                          setCommentReply((prev) =>
                            prev.parentIndex === index ? { parentIndex: null, text: "" } : { parentIndex: index, text: "" }
                          )
                        }
                      >
                        Reply
                      </button>
                    </div>


                    {/* Reply Input */}
                    {commentReply.parentIndex === index && (
                      <div ref={replyInputRef} className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <input
                          type="text"
                          value={commentReply.text}
                          onChange={(e) => setCommentReply({ ...commentReply, text: e.target.value })}
                          className="border px-2 py-1 text-sm w-full rounded-md bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Write a reply..."
                        />
                        <button
                          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded-md transition"
                          onClick={addReply}
                        >
                          Submit
                        </button>
                      </div>
                    )}

                    {/* Display replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                        {c.replies.map((reply, rIndex) => (
                          <p key={rIndex} className="text-sm text-gray-600 dark:text-gray-400">↳ {reply}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          </div>

        </div>
      </CardContent>
    </div>
  );
}

// Pop-up Dialog Component
function PopUpDialog({ newProposal, setNewProposal, handleFileChange, addProposal, closeDialog, loading, submitted }) {
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

          {/* Submit Button */}
          <Button className="w-full bg-blue-500 text-white px-4 py-2 rounded" onClick={addProposal}>
            Submit Proposal
          </Button>
        </div>
      </div>
    </>
  );
}
