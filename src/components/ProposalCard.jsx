import { useState, useRef, useEffect } from "react";
import { CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Reply } from "lucide-react";
import { useToggle } from "../hooks/useToggle";
import { ConfirmDialog } from "../components/ConfirmationDialog";
import { useConfirmationDialog } from "../hooks/useConfirmationDialog";
import { currentLoginUser } from "../data";

export function ProposalCard({ proposal, proposals, setProposals, role }) {
  const [comment, setComment] = useState("");
  const [commentReply, setCommentReply] = useState({ parentIndex: null, text: "" });
  const [vote, toggleVote] = useToggle();
  const replyInputRef = useRef(null);
  const { isOpen, openDialog, closeDialog, confirm } = useConfirmationDialog();

  const { id, name, avatarUrl } = currentLoginUser.find(user => user.role.toLowerCase() === role.toLowerCase()) || {};
  const currentUser = { id, name, avatarUrl };


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
    const newComment = {
      user: currentUser,
      text: comment,
      timestamp: new Date().toLocaleString(),
      replies: [],
    };
    setProposals(
      proposals.map((p) =>
        p.id === proposal.id
          ? { ...p, comments: [...p.comments, newComment] }
          : p
      )
    );
    setComment("");
  }

  function deleteComment(index) {
    openDialog;
    const updatedComment = proposal.comments.filter((_, i) => i !== index);
    setProposals(
      proposals.map((p) =>
        p.id === proposal.id
          ? { ...p, comments: updatedComment }
          : p
      )
    );
  }

  function addReply() {
    if (commentReply.text.trim() === "" || commentReply.parentIndex === null) return;

    const newReply = {
      user: currentUser,
      text: commentReply.text.trim(),
      timestamp: new Date().toLocaleString(),
    };

    setProposals(proposals.map((p) => {
      if (p.id === proposal.id) {
        const updatedComments = p.comments.map((c, index) =>
          index === commentReply.parentIndex
            ? { ...c, replies: [...c.replies, newReply] }
            : c
        );
        return { ...p, comments: updatedComments };
      }
      return p;
    }));
    setCommentReply({ parentIndex: null, text: "" });
  }

  const handleKeyDownComment = (e) => {
    if (e.key === "Enter") {
      addComment();
    }
  };

  const handleKeyDownReply = (e) => {
    if (e.key === "Enter") {
      addReply();
    }
  };


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
              {typeof proposal.file === "string" ? (
                <a href={proposal.file} download className="underline cursor-pointer">
                  {proposal.file.split("/").pop() || "Download"}
                </a>
              ) : (
                <span
                  className="download-link underline cursor-pointer"
                  onClick={() => {
                    const url = URL.createObjectURL(proposal.file);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = proposal.file.name;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  {proposal.file.name || "Download"}
                </span>
              )}
            </div>
          )}


          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Votes: {proposal.votes}</span>
            <Button className={`${vote ? "bg-red-500" : "bg-green-500"} text-white px-4 py-2 rounded`} onClick={handleVote}>
              {vote ? "Unvote" : "Vote"}
            </Button>
          </div>

          {/* COMMENT SECTION */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h4 className="font-semibold text-lg mb-3">Discussion</h4>

            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDownComment}
              />
              <Button className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition" onClick={addComment}>
                <Reply size={20} /> Comment
              </Button>
            </div>

            <div className="mt-4">
              {
                proposal.comments.map((c, index) => (
                  <div key={index} className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <img src={c.user.avatarUrl} alt={c.user.name} className="w-8 h-8 rounded-full mr-2" />
                      <p className="text-sm text-gray-900 dark:text-gray-200 font-semibold">{c.user.name}</p>
                      <span className="text-xs text-gray-500 ml-2">{c.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-200 font-semibold ml-10 mt-1"> {c.text}</p>
                    <div className="flex flex-row justify-end gap-3">
                      <button
                        className="top-2 right- text-blue-500 text-xs hover:underline cursor-pointer"
                        onClick={() =>
                          setCommentReply((prev) =>
                            prev.parentIndex === index ? { parentIndex: null, text: "" } : { parentIndex: index, text: "" }
                          )
                        }
                      >
                        Reply
                      </button>
                      {role === "Admin" ? (
                        <button className="top-2 right-3 text-red-400 text-xs hover:underline cursor-pointer" onClick={() => openDialog(() => deleteComment(index))}>
                          Delete
                        </button>
                      ) : ""}
                    </div>

                    <ConfirmDialog
                      open={isOpen}
                      onClose={closeDialog}
                      onConfirm={confirm}
                      message="Are you sure you want to delete this comment?">

                    </ConfirmDialog>


                    {/* Reply Input */}
                    {commentReply.parentIndex === index && (
                      <div ref={replyInputRef} className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <input
                          type="text"
                          value={commentReply.text}
                          onChange={(e) => setCommentReply({ ...commentReply, text: e.target.value })}
                          className="border px-2 py-1 text-sm w-full rounded-md bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Write a reply..."
                          onKeyDown={handleKeyDownReply}
                        />
                        <button
                          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs rounded-md transition cursor-pointer"
                          onClick={addReply}
                        >
                          Submit
                        </button>
                      </div>
                    )}

                    {c.replies && c.replies.length > 0 && (
                      <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                        {c.replies.map((reply, rIndex) => (
                          <div key={rIndex} className="flex items-center">
                            <img src={reply.user.avatarUrl} alt={reply.user.name} className="w-6 h-6 rounded-full mr-2" />
                            <p className="text-sm text-gray-600 dark:text-gray-400">{reply.user.name} <span className="text-xs text-gray-500">{reply.timestamp}</span>: {reply.text}</p>
                          </div>
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